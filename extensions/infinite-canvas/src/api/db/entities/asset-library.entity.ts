import { ExtensionEntity } from "@buildingai/core/decorators";
import { Column, CreateDateColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

import { AssetCategory } from "./asset-category.entity";

@ExtensionEntity()
export class AssetLibrary {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ length: 120 })
    name: string;

    @Column({ type: "int", default: 0 })
    sort: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => AssetCategory, (category) => category.library)
    categories?: AssetCategory[];
}
