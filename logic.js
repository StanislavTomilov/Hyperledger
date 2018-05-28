/**
 * Функция для осуществления передачи прав владения товаром
 * @param {org.example.mynetwork.Trade} trade - запуск передачи товара
 * @transaction
 */
async function tradeCommodity(trade) {

    // установка нового владельца товара
    trade.commodity.owner = trade.newOwner;
    let assetRegistry = await getAssetRegistry('org.example.mynetwork.Commodity');

    // выпуск события о том, что смена владельца произошла
    let tradeNotification = getFactory().newEvent('org.example.mynetwork', 'TradeNotification');
    tradeNotification.commodity = trade.commodity;
    emit(tradeNotification);

    // сохраняем состояние актива в реестре
    await assetRegistry.update(trade.commodity);
}

/**
 * Удаляем товары зарегистрированные в большом количестве
 * @param {org.example.mynetwork.RemoveHighQuantityCommodities} remove - запуск удаления товаров
 * @transaction
 */
async function removeHighQuantityCommodities(remove) {

    let assetRegistry = await getAssetRegistry('org.example.mynetwork.Commodity');
    let results = await query('selectCommoditiesWithHighQuantity');

    for (let n = 0; n < results.length; n++) {
        let trade = results[n];

        // запускаем уведомление о том, что товар удален
        let removeNotification = getFactory().newEvent('org.example.mynetwork','RemoveNotification');
        removeNotification.commodity = trade;
        emit(removeNotification);
        await assetRegistry.remove(trade);
    }
}
