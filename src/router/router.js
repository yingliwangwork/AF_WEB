const BaseLayout = () => import("@/components/BaseLayout.vue");

const routes = [
  {
    path: "/",
    component: BaseLayout,
    children: [
      {
        path: "/",
        name: "Home",
        component: () => import("@/views/Home/Home.vue"),
      }
    ]
  },
  {
    path: "/Y1",
    component: BaseLayout,
    children: [
      {
        path: "AFY10100",
        name: "AFY10100",
        component: () => import("@/views/Y1/AFY10100.vue"),
        children: [
          {
            path: "detail",
            name: "AFY10100Detail",
            component: () => import("@/views/Y1/AFY10100Detail.vue"),
          },
        ]
      },
      {
        path: "AFY10300",
        name: "AFY10300",
        component: () => import("@/views/Y1/AFY10300.vue"),
      },
      {
        path: "AFY10400",
        name: "AFY10400",
        component: () => import("@/views/Y1/AFY10400.vue"),
      },
    ],
  },
  {
    path: "/A0",
    component: BaseLayout,
    children: [
      {
        path: "ATA08110",
        name: "ATA08110",
        component: () => import("@/views/A0/ATA08110.vue"),
      },
      {
        path: "ATA08120",
        name: "ATA08120",
        component: () => import("@/views/A0/ATA08120.vue"),
      },
    ],
  },
];

export default { routes };
