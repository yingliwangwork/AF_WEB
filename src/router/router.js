const BaseLayout = () => import("@/components/BaseLayout.vue");

const routes = [
    {
        path: "/",
        component: BaseLayout,
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
        path: "/Y1",
        name: "Y1",
        component: BaseLayout,
        children: [
            {
                path: "AFY10100",
                name: "AFY10100",
                component: () => import("@/views/Y1/AFY10100.vue"),
            },
        ],
    },
    {
        path: "/:catchAll(.*)",
        redirect: "/",
    },
];

export default { routes };
