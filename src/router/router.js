const BaseLayout = () => import("@/components/BaseLayout.vue");

const routes = [
    {
        path: "/",
        component: BaseLayout,
    },
    {
        path: "/DSA",
        name: "DSA",
        component: BaseLayout,
        children: [
            {
                path: "DSA21000",
                name: "DSA21000",
                component: () => import("@/views/DSA/DSA21000.vue"),
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
