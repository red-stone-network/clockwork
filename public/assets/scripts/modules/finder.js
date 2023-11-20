const searchables = [
    {
        searchText: ["prefs", "preferences"],
        name: "Settings",
        icon: "/assets/images/ui/settings.png",
        onclick: function () {
            openApp('sys_settings');
        },
    },
    {
        searchText: ["chat", "discord"],
        name: "Chat on Discord",
        icon: "/assets/images/ui/discord.png",
        onclick: function () {
            window.open("https://discord.gg/Sb8NzVbqX8", "_blank");
        },
    },
    {
        searchText: ["email", "support"],
        name: "Contact Support",
        icon: "/assets/images/support.png",
        onclick: function () {
            window.open("mailto:support@mail.redstonenetwork.rit.cl", "_blank");
        },
    },
    {
        searchText: ["apps", "manage apps", "uninstall apps", "app settings"],
        name: "Manage Apps",
        icon: "/assets/images/ui/app-window.png",
        onclick: function () {
            openApp('sys_settings');
            loadSettingsScreen("Manage Apps");
        },
    },
    {
        searchText: ["themes", "manage themes", "uninstall themes", "reorder themes", "set themes", "theme settings"],
        name: "Manage Themes",
        icon: "/assets/images/ui/paintbrush-on-app-window.png",
        onclick: function () {
            openApp('sys_settings');
            loadSettingsScreen("Manage Themes");
        },
    },
    {
        searchText: ["proxy settings", "unblock settings", "unblocking settings", "ultraviolet settings"],
        name: "Proxy Settings",
        icon: "/assets/images/ui/ultraviolet.png",
        onclick: function () {
            openApp('sys_settings');
            loadSettingsScreen("Proxy Settings");
        },
    },
    {
        searchText: ["passcode settings", "password settings", "lock settings"],
        name: "Passcode Settings",
        icon: "/assets/images/ui/key.png",
        onclick: function () {
            openApp('sys_settings');
            loadSettingsScreen("Passcode Settings");
        },
    },
    {
        searchText: ["control center settings", "time settings", "24-hour time", "12-hour time"],
        name: "Personalization",
        icon: "/assets/images/ui/paintbrush.png",
        onclick: function () {
            openApp('sys_settings');
            loadSettingsScreen("Personalization");
        },
    },
    {
        searchText: ["about clockwork", "version clockwork", "clockwork version"],
        name: "About Clockwork",
        icon: "/assets/images/ui/clockwork.png",
        onclick: function () {
            openApp('sys_settings');
            loadSettingsScreen("About Clockwork");
        },
    },
]