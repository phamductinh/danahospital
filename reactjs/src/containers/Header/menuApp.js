export const adminMenu = [
	{
		//quản lý người dùng
		name: "menu.admin.manage-user",
		menus: [
			{
				name: "menu.admin.manage-user",
				link: "/system/user-manage",
			},
		],
	},
	{
		//quản lý người dùng
		name: "menu.admin.manage-telemedicine",
		menus: [
			{
				name: "menu.admin.manage-telemedicine",
				link: "/system/manage-telemedicine",
			},
		],
	},
	{
		//quản lý người dùng
		name: "menu.admin.manage-specialty",
		menus: [
			{
				name: "menu.admin.manage-specialty",
				link: "/system/manage-specialty",
			},
		],
	},
	{
		//quản lý người dùng
		name: "menu.admin.manage-service",
		menus: [
			{
				name: "menu.admin.manage-service",
				link: "/system/manage-service",
			},
		],
	},
	{
		//quản lý người dùng
		name: "menu.admin.manage-doctor",
		menus: [
			{
				name: "menu.admin.manage-doctor",
				link: "/system/manage-doctor",
			},
			{
				name: "menu.admin.manage-booking-pending",
				link: "/system/manage-booking",
			},
			{
				name: "menu.admin.manage-confirmed-booking",
				link: "/system/manage-confirmed-booking",
			},
			{
				name: "menu.admin.manage-telemedicine-booking",
				link: "/system/manage-telemedicine-booking",
			},
			{
				name: "menu.admin.manage-finished-booking",
				link: "/system/manage-finished-booking",
			},
		],
	},

	{
		//quản lý đánh giá
		name: "menu.admin.manage-review",
		menus: [
			{
				name: "menu.admin.manage-review",
				link: "/system/manage-review",
			},
		],
	},
	{
		//quản lý chat
		name: "menu.admin.manage-chats",
		menus: [
			{
				name: "menu.admin.manage-chats",
				link: "/system/manage-chats",
			},
		],
	},
];

export const doctorMenu = [
	{
		//quản lý bac si
		name: "menu.doctor.doctor",
		menus: [
			{
				name: "menu.admin.manage-confirmed-booking",
				link: "/system/manage-confirmed-booking",
			},
			{
				name: "menu.admin.manage-telemedicine-booking",
				link: "/system/manage-telemedicine-booking",
			},
			{
				name: "menu.admin.manage-finished-booking",
				link: "/system/manage-finished-booking",
			},
		],
	},
];
