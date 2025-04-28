import { celebrate, Segments } from "celebrate";
import { Request, Response } from "express";
import { v4 } from "uuid";
import { KioskCampaignsRequest } from "../../../../interfaces";
import { KioskCampaignsRequestSchema } from "../../../../schemas";
import { IKioskCampaignsResponse } from "../../../../types";

export const post = [
  celebrate({
    [Segments.BODY]: KioskCampaignsRequestSchema,
  }),
  async (req: Request, res: Response) => {
    if (req.method !== "POST") return res.status(405);

    const kioskId = req.params.kioskId;
    const body: KioskCampaignsRequest = req.body;

    return res.json({
      MessageId: v4(),
      Success: true,
      Errors: [],
      InCarts: [
        // this gave a "1 free movie" promo popup
        // {
        //     CampaignInCartId: 1,
        //     InCartType: EInCartType.StartScreen,
        //     PromoCode: "PROMO",
        //     ExcludeTitles: [],
        // },
      ],
      StartScreens: [
        // {
        //     Controls: [
        //         {
        //             ControlType: EControlType.StartAsset,
        //             Asset: {
        //                 Id: 1,
        //                 Name: "Asset 1",
        //                 Url: "https://picsum.photos/200",
        //                 FullPath: "https://picsum.photos/200",
        //             },
        //             ControlId: 1,
        //             DisplayDuration: 1000,
        //             IncludeIfNoInventory: true,
        //             Order: 1,
        //             MaxTitles: 100,
        //             ShowPressToStart: true,
        //             Target: EAssetTarget.PromoCode,
        //             TargetValue: "1",
        //         },
        //     ],
        // },
      ],
    } as IKioskCampaignsResponse);
  },
];
