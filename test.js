const str = `[
    {
        "barberShopId": 1,
        "barberShopName": "Barbearia do Gabriel",
        "barberShopPhone": "555499026453",
        "barberShopCity": "CZO",
        "barberShopCityName": "Carazinho",
        "barberShopNeighborhood": "Centro",
        "barberShopStreet": "Alexandre da Motta",
        "barberShopNumber": "1264",
        "barberShopComplement": null,
        "availableDays": "[1,2,3,4,5]",
        "availableHours": "[{\"1\":[\"7:30 12:00\",\"13:30 18:00\"]}],{\"2\":[\"7:30 12:00\",\"13:30 18:00\"],{\"3\":[\"7:30 12:00\",\"13:30 18:00\"]}],{\"4\":[\"7:30 12:00\",\"13:30 18:00\"]}],{\"5\":[\"7:30 12:00\",\"13:30 18:00\"]}]}]",
        "geolocationLatitude": "-28.290535",
        "geolocationLongitude": "-52.786843",
        "barberShopWppId": "555499026453@c.us"
    }
]`;

const r = str.replace('\\','');
console.log(r);