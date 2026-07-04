import { ExtensionEntity } from "@buildingai/core/decorators";
import { Column, CreateDateColumn, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { AssetCategory } from "./asset-category.entity";

export enum AssetKind {
    IMAGE = "image",
    VIDEO = "video",
    AUDIO = "audio",
    WORKFLOW = "workflow",
}

@ExtensionEntity()
export class AssetItem {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid" })
    categoryId: string;

    @Column({ length: 180 })
    name: string;

    @Column({ type: "varchar", length: 24, default: AssetKind.IMAGE })
    kind: AssetKind;

    @Column({ length: 1000, nullable: true })
    url?: string;

    @Column({ type: "text", nullable: true })
    description?: string;

    @Column({ type: "jsonb", default: () => "'[]'::jsonb" })
    tags: string[];

    @Column({ type: "varchar", length: 24, default: "none" })
    avatarStatus: "none" | "registering" | "registered" | "failed";

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => AssetCategory, (category) => category.items)
    @JoinColumn({ name: "categoryId" })
    category?: AssetCategory;
}
