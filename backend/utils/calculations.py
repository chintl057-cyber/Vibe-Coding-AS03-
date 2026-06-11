from typing import Dict, List, Tuple
from schemas.basket import (
    SplitBasketAllocation,
    SplitBasketResult,
    ItemSavingsInsight,
    CategorySavingsInsight,
    BasketStoreTotal,
)

def format_currency(value: float) -> float:
    return round(value, 2)

def get_cheapest_store_for_product(prices: Dict[str, float]) -> Tuple[str, float]:
    if not prices:
        return None, None
    return min(prices.items(), key=lambda x: x[1])

def get_second_cheapest_store_for_product(prices: Dict[str, float]) -> Tuple[str, float]:
    if not prices or len(prices) < 2:
        return None, None
    sorted_prices = sorted(prices.items(), key=lambda x: x[1])
    return sorted_prices[1]

def get_basket_totals_by_store(
    products: Dict[str, any],
    basket_items: List[Dict],
) -> Dict[str, float]:
    store_totals = {}
    
    for item in basket_items:
        product = products.get(item["product_id"])
        if not product:
            continue
        
        quantity = item["quantity"]
        prices = product.get("prices", {})
        
        for store, price in prices.items():
            if store not in store_totals:
                store_totals[store] = 0
            store_totals[store] += price * quantity
    
    return {store: format_currency(total) for store, total in store_totals.items()}

def get_cheapest_basket_option(store_totals: Dict[str, float]) -> Tuple[BasketStoreTotal, BasketStoreTotal]:
    sorted_stores = sorted(store_totals.items(), key=lambda x: x[1])
    
    cheapest = BasketStoreTotal(store=sorted_stores[0][0], total=sorted_stores[0][1])
    second_cheapest = BasketStoreTotal(store=sorted_stores[1][0], total=sorted_stores[1][1]) if len(sorted_stores) > 1 else cheapest
    
    return cheapest, second_cheapest

def get_split_basket_optimisation(
    products: Dict[str, any],
    basket_items: List[Dict],
    cheapest_store_total: BasketStoreTotal,
) -> SplitBasketResult:
    allocations = []
    stores_used = set()
    total_cost = 0
    
    for item in basket_items:
        product = products.get(item["product_id"])
        if not product:
            continue
        
        quantity = item["quantity"]
        prices = product.get("prices", {})
        cheapest_store, cheapest_price = get_cheapest_store_for_product(prices)
        
        if cheapest_store:
            stores_used.add(cheapest_store)
            line_total = cheapest_price * quantity
            total_cost += line_total
            
            allocation = SplitBasketAllocation(
                product_id=product["id"],
                product_name=product["name"],
                category=product["category"],
                store=cheapest_store,
                unit_price=cheapest_price,
                quantity=quantity,
                line_total=format_currency(line_total),
            )
            allocations.append(allocation)
    
    extra_savings = format_currency(cheapest_store_total.total - total_cost)
    
    return SplitBasketResult(
        total_cost=format_currency(total_cost),
        allocations=allocations,
        stores_used=list(stores_used),
        extra_savings_vs_single_store=extra_savings,
    )

def get_top_saving_items(
    products: Dict[str, any],
    basket_items: List[Dict],
) -> List[ItemSavingsInsight]:
    insights = []
    
    for item in basket_items:
        product = products.get(item["product_id"])
        if not product:
            continue
        
        quantity = item["quantity"]
        prices = product.get("prices", {})
        
        recommended_store, recommended_price = get_cheapest_store_for_product(prices)
        alternative_store, alternative_price = get_second_cheapest_store_for_product(prices)
        
        if recommended_store and alternative_store:
            savings_per_unit = format_currency(alternative_price - recommended_price)
            total_savings = format_currency(savings_per_unit * quantity)
            
            insight = ItemSavingsInsight(
                product_id=product["id"],
                product_name=product["name"],
                category=product["category"],
                recommended_store=recommended_store,
                alternative_store=alternative_store,
                savings_per_unit=savings_per_unit,
                quantity=quantity,
                total_savings=total_savings,
            )
            insights.append(insight)
    
    # Sort by total savings descending and return top 5
    return sorted(insights, key=lambda x: x.total_savings, reverse=True)[:5]

def get_category_savings_breakdown(
    top_saving_items: List[ItemSavingsInsight],
) -> List[CategorySavingsInsight]:
    category_savings = {}
    
    for item in top_saving_items:
        if item.category not in category_savings:
            category_savings[item.category] = 0
        category_savings[item.category] += item.total_savings
    
    return [
        CategorySavingsInsight(category=cat, total_savings=format_currency(savings))
        for cat, savings in sorted(category_savings.items(), key=lambda x: x[1], reverse=True)
    ]
