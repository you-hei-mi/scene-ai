import { BaseController } from "@buildingai/base";
import { ExtensionWebController } from "@buildingai/core/decorators";
import { Body, Post } from "@nestjs/common";

import { StudioService } from "../studio.service";

@ExtensionWebController("actions")
export class ActionsWebController extends BaseController {
    constructor(private readonly studioService: StudioService) {
        super();
    }

    @Post("generate")
    async generate(@Body() payload: Record<string, unknown>) {
        return this.studioService.generateImage(payload);
    }

    @Post("chat")
    async chat(@Body() payload: Record<string, unknown>) {
        return this.studioService.chat(payload);
    }
}
