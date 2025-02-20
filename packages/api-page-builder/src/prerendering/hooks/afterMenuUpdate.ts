import { ContextPlugin } from "@webiny/handler";
import { PbContext } from "~/graphql/types";

export default () => {
    return new ContextPlugin<PbContext>(async context => {
        /**
         * After a menu has changed, invalidate all pages that contain the updated menu.
         */
        context.pageBuilder.onAfterMenuUpdate.subscribe(async ({ menu }) => {
            await context.pageBuilder.prerendering.render({
                context,
                tags: [{ tag: { key: "pb-menu", value: menu.slug } }]
            });
        });
    });
};
