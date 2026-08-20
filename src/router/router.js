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
        path: "/A2",
        name: "A2",
        component: BaseLayout,
        children: [
            {
                path: "DSA21000",
                name: "DSA21000",
                component: () => import("@/views/A2/DSA21000.vue"),
            },
        ],
    },
    {
        path: "/:catchAll(.*)",
        redirect: "/",
    },
];

export default { routes };
