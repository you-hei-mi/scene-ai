import { ExtensionEntity } from "@buildingai/core/decorators";
import {
    Column,
    CreateDateColumn,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";

import { AssetItem } from "./asset-item.entity";
import { AssetLibrary } from "./asset-library.entity";

@ExtensionEntity()
export class AssetCategory {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "uuid" })
    libraryId: string;

    @Column({ length: 120 })
    name: string;

    @Column({ type: "int", default: 0 })
    sort: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => AssetLibrary, (library) => library.categories)
    @JoinColumn({ name: "libraryId" })
    library?: AssetLibrary;

    @OneToMany(() => AssetItem, (item) => item.category)
    items?: AssetItem[];
}
