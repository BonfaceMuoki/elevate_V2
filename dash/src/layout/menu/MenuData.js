import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
const menuadmin = [
  {
    icon: "home",
    text: "Dashboard",
    link: "/admin-dashboard",
  },
  {
    icon: "users",
    text: "User Manager",
    active: false,
    subMenu: [
      {
        text: "User List - Club Members",
        link: "/admin/users",
      },
      {
        text: "User List - Suppliers",
        link: "/admin/suppliers",
      },
      {
        text: "User List - Sponsorship Links",
        link: "/admin/sponsorship-links",
      },
    ],
  },
  {
    icon: "users",
    text: "Payments",
    active: false,
    subMenu: [
      // {
      //   text: "Payments - Pending",
      //   link: "/admin/pending-members-pay",
      // },
      // {
      //   text: "Matrix - Payments List",
      //   link: "/admin/matrix-payments-list",
      // },
      {
        text: "Bonus - Payments List",
        link: "/admin/bonus-payments-list",
      },
      // {
      //   text: "Company - Payments List",
      //   link: "/admin/company-payments-list",
      // },
    ],
  },
  {
    icon: "briefcase",
    text: "Subscription Links",
    active: false,
    subMenu: [
      {
        text: "Active Subscription Links",
        link: "/admin/subsscription-links",
      },
    ],
  },
  {
    icon: "briefcase",
    text: "Elevate  Tiers",
    active: false,
    subMenu: [
      {
        text: "All Tiers",
        link: "/admin/tiers",
      },
    ],
  },
  {
    icon: "bag",
    text: "Orders",
    active: false,
    subMenu: [
      {
        text: "All Orders",
        link: "/admin/orders",
      },
    ],
  },
  // {
  //     icon: "setting",
  //     text: "Settings",
  //     active: false,
  //     subMenu: [{
  //             text: "Roles - Roles List",
  //             link: "/admin/roles",
  //         },
  //         {
  //             text: "Permissions - Permissions List",
  //             link: "/admin/permissions",
  //         },
  //     ],
  // },
];

const menucontributor = [
  {
    icon: "home",
    text: "Dashboard",
    link: "/",
  },
  {
    icon: "cart",
    text: "Shop",
    link: "/products",
  },
  {
    icon: "bag",
    text: "My Orders",
    link: "/my-orders",
  },
  //  ,
  // {
  //     icon: "money",
  //     text: "Earnings",
  //     active: false,
  //     subMenu: [{
  //             text: "Earnings - Invite Bonuses",
  //             link: "/contributor/my-invite-bonuses",
  //         },
  //         {
  //             text: "Earnings - Matrix",
  //             link: "/contributor/my-matrix-earnings",
  //         },
  //     ],
  // },
  // {
  //     icon: "setting-fill",
  //     text: "Settings",
  //     active: false,
  //     subMenu: [{
  //         text: "Profile ",
  //         link: "/supplier/my-users",
  //     }],
  // },
  // {
  //   icon: "briefcase",
  //   text: "Billing",
  //   active: false,
  //   subMenu: [
  //     {
  //       text: "My Credits",
  //       link: "valuation-firm/my-credits",
  //     },
  //     {
  //       text: "Make Payments",
  //       link: "/valuation-firm/make-payment",
  //     },
  //   ],
  // },
];

const menu = { admin: menuadmin, contributor: menucontributor };
// const userrole = currentuser?.role_name;
// const [menu, setMenu ] = useState([]);
// setMenu(menuadmin);

// useEffect(() => {
//   if (userrole === "Super Admin") {
//     setMenu(menuadmin);
//   } else if (userrole == "Report Uploader" || userrole == "Report Uploader Admin") {
//     setMenu(menuvaluer);
//   } else if (userrole == "Report Accessor" || userrole == "Report Accessor Admin") {
//     setMenu(menulender);
//   }
// }, [userrole]);

export default menu;
