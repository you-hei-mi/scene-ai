import { BaseController } from "@buildingai/base";
import { ExtensionWebController } from "@buildingai/core/decorators";
import { Body, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";

import { StudioService } from "../studio.service";

@ExtensionWebController("conversations")
export class ConversationWebController extends BaseController {
    constructor(private readonly studioService: StudioService) {
        super();
    }

    @Get()
    list() {
        return this.studioService.listConversations();
    }

    @Post()
    create(@Body() payload: Record<string, unknown>) {
        return this.studioService.createConversation(payload);
    }

    @Get(":id")
    detail(@Param("id") id: string) {
        return this.studioService.getConversation(id);
    }

    @Put(":id")
    save(@Param("id") id: string, @Body() payload: Record<string, unknown>) {
        return this.studioService.saveConversation(id, payload);
    }

    @Delete(":id")
    delete(@Param("id") id: string) {
        return this.studioService.deleteConversation(id);
    }
}
