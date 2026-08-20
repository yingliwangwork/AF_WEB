const BaseLayout = () => import("@/components/BaseLayout.vue");

const routes = [
    {
        path: "/",
        component: BaseLayout,
    },
    {
        path: "/AFY1",
        name: "AFY1",
        component: BaseLayout,
        children: [
            {
                path: "AFY10100",
                name: "AFY10100",
                component: () => import("@/views/AFY1/AFY10100.vue"),
            },
        ],
    },
    // 新增頁面路由請比照以下格式：
    // {
    //     path: "/<ModuleCode>",
    //     name: "<ModuleCode>",
    //     component: BaseLayout,
    //     children: [
    //         {
    //             path: "<FeatureCode>",
    //             name: "<FeatureCode>",
    //             component: () => import("@/views/<ModuleCode>/<FeatureCode>.vue"),
    //             children: [
    //                 {
    //                     path: "<SubPageName>",
    //                     name: "<FeatureCode><SubPageName>",
    //                     component: () => import("@/views/<ModuleCode>/<FeatureCode>/<SubPageName>.vue"),
    //                 },
    //             ],
    //         },
    //     ],
    // },
    {
        path: "/:catchAll(.*)",
        redirect: "/",
    },
];

export default { routes };
