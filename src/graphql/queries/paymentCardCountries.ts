export interface IPaymentCardCountriesResponse {
	countries: {
		data: {
			id: Country['id']
			attributes: Omit<Country, 'id' | 'flag'> & {
				flag: {
					data: {
						attributes: Omit<Flag, 'id' | 'name' | 'alternativeText'>
					}
				}
			}
		}
	}
}

/*
* {
    "id": 30,
    "name": "Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6-ea07-4094-b8c8-9e0fdbe88264.png",
    "alternativeText": "Teste alternative text",
    "caption": null,
    "width": 960,
    "height": 1664,
    "formats": {
        "thumbnail": {
            "name": "thumbnail_Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6-ea07-4094-b8c8-9e0fdbe88264.png",
            "hash": "thumbnail_Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6_ea07_4094_b8c8_9e0fdbe88264_696ff6113c",
            "ext": ".png",
            "mime": "image/png",
            "path": null,
            "width": 90,
            "height": 156,
            "size": 31.66,
            "url": "/uploads/thumbnail_Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6_ea07_4094_b8c8_9e0fdbe88264_696ff6113c.png"
        },
        "xsmall": {
            "name": "xsmall_Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6-ea07-4094-b8c8-9e0fdbe88264.png",
            "hash": "xsmall_Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6_ea07_4094_b8c8_9e0fdbe88264_696ff6113c",
            "ext": ".png",
            "mime": "image/png",
            "path": null,
            "width": 37,
            "height": 64,
            "size": 6.26,
            "url": "/uploads/xsmall_Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6_ea07_4094_b8c8_9e0fdbe88264_696ff6113c.png"
        },
        "small": {
            "name": "small_Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6-ea07-4094-b8c8-9e0fdbe88264.png",
            "hash": "small_Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6_ea07_4094_b8c8_9e0fdbe88264_696ff6113c",
            "ext": ".png",
            "mime": "image/png",
            "path": null,
            "width": 288,
            "height": 500,
            "size": 253.04,
            "url": "/uploads/small_Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6_ea07_4094_b8c8_9e0fdbe88264_696ff6113c.png"
        },
        "medium": {
            "name": "medium_Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6-ea07-4094-b8c8-9e0fdbe88264.png",
            "hash": "medium_Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6_ea07_4094_b8c8_9e0fdbe88264_696ff6113c",
            "ext": ".png",
            "mime": "image/png",
            "path": null,
            "width": 433,
            "height": 750,
            "size": 540.32,
            "url": "/uploads/medium_Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6_ea07_4094_b8c8_9e0fdbe88264_696ff6113c.png"
        },
        "large": {
            "name": "large_Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6-ea07-4094-b8c8-9e0fdbe88264.png",
            "hash": "large_Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6_ea07_4094_b8c8_9e0fdbe88264_696ff6113c",
            "ext": ".png",
            "mime": "image/png",
            "path": null,
            "width": 577,
            "height": 1000,
            "size": 938.4,
            "url": "/uploads/large_Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6_ea07_4094_b8c8_9e0fdbe88264_696ff6113c.png"
        }
    },
    "hash": "Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6_ea07_4094_b8c8_9e0fdbe88264_696ff6113c",
    "ext": ".png",
    "mime": "image/png",
    "size": 630.15,
    "url": "/uploads/Ghxst_Behold_the_Kingdom_of_the_Wretched_Undying_3555fee6_ea07_4094_b8c8_9e0fdbe88264_696ff6113c.png",
    "previewUrl": null,
    "provider": "local",
    "provider_metadata": null,
    "folderPath": "/",
    "createdAt": "2023-07-27T13:05:35.471Z",
    "updatedAt": "2023-07-27T13:05:35.471Z"
}
*
* */