export const DynamicHeaderMenuConfig = {
  items: [
    {
      title: 'Tablero',
      root: true,
      alignment: 'left',
      page: '/dashboard',
      code: "DB000",
      show: false,
      translate: 'MENU.DASHBOARD'
    },
    {
      title: 'Administración',
      root: true,
      code: "ADM000",
      alignment: 'left',
      page: '/administration',
      show: false,
      submenu: [
        {
          title: 'Gestión Permisos',
          bullet: 'dot',
          show: false,
          code: "ADM010",
          submenu: [
            {
              title: 'Usuarios',
              show: false,
              bullet: 'dot',
              code: "ADM011",
              page: '/admin/permissions/users'
            },
            {
              title: 'Roles',
              show: false,
              bullet: 'dot',
              code: "ADM012",
              page: '/admin/permissions/roles'
            }
          ]
        },
      ]
    },
    {
      title: 'Donaciones MCI',
      root: true,
      code: "DO000",
      alignment: 'left',
      page: '/donations',
      show: false,
      submenu: [
        {
          title: 'Dashboard',
          root: true,
          show: false,
          bullet: 'dot',
          code: "DO010",
          page: '/donations/dashboard'
        },
        {
          title: 'Reportes',
          root: true,
          show: false,
          bullet: 'dot',
          code: "DO020",
          page: '/donations/reports'
        }
      ]
    },
    {
      title: 'Eventos G12',
      root: true,
      code: "EVT000",
      alignment: 'left',
      page: '/g12events',
      show: false,
      submenu: [
        {
          title: 'Inicio',
          root: true,
          show: false,
          bullet: 'dot',
          code: "EVT010",
          page: '/g12events/home'
        },
        {
          title: 'Nuevo Evento',
          root: true,
          show: false,
          bullet: 'dot',
          code: "EVT020",
          page: '/g12events/add'
        },
        {
          title: 'Reportes',
          root: true,
          show: false,
          bullet: 'dot',
          code: "EVT030",
          page: '/g12events/reports'
        }
      ]
    }
  ]
};
