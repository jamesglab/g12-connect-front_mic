export const DynamicHeaderMenuConfig = {
  items: [
    {
      title: 'Tablero',
      root: true,
      alignment: 'left',
      page: '/dashboard',
      code: "DB000",
      show: true,
      translate: 'MENU.DASHBOARD',
    },
    {
      title: 'Administración',
      root: true,
      code: "ADM000",
      alignment: 'left',
      page: '/administration',
      show: true,
      submenu: [
        {
          title: 'Gestión Permisos',
          bullet: 'dot',
          show: true,
          submenu: [
            {
              title: 'Usuarios',
              show: true,
              bullet: 'dot',
              page: '/admin/permissions/users'
            },
            {
              title: 'Roles',
              show: true,
              bullet: 'dot',
              page: '/admin/permissions/roles'
            },
            {
              title: 'Objetos',
              show: true,
              bullet: 'dot',
              page: '/admin/permissions/objects'
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
      show: true,
      submenu: [
        {
          title: 'Dashboard',
          root: true,
          show: true,
          bullet: 'dot',
          page: '/donations/dashboard'
        },
        {
          title: 'Reportes',
          root: true,
          show: true,
          bullet: 'dot',
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
      show: true,
      submenu: []
    },
    // {
    //   title: 'Mi Perfil',
    //   alignment: 'left',
    //   page: '/profile',
    //   show: false,
    // },
    {
      title: 'Ganar',
      bullet: 'dot',
      page: '/to-win',
      code: "G000",
      show: true,
      icon: 'flaticon-interface-6',
      submenu: [
        {
          title: 'Personas',
          bullet: 'dot',
          show: true,
          code: "G001",
          submenu: [
            {
              title: 'Registrar Nueva',
              show: true,
              page: '/to-win/people',
            },
            {
              title: 'Buscar Persona',
              show: true,
              page: '/to-win/people/search',
            }
          ]
        },
        {
          title: 'Fono Visita',
          bullet: 'dot',
          show: true,
          code: "G002",
          page: '/to-win/phone-visit'
        },
        {
          title: 'Reportes Ganar',
          bullet: 'dot',
          show: true,
          code: "G004",
          page: '/to-win/reports',
        }
      ]
    },
    {
      title: 'Enviar',
      bullet: 'dot',
      page: '/send',
      code: "ENV000",
      show: true,
      icon: 'flaticon-interface-7',
      submenu: [
        {
          title: 'Gestión Célula',
          bullet: 'dot',
          show: true,
          svg: './assets/media/svg/icons/Design/PenAndRuller.svg',
          submenu: [
            {
              title: 'Lideres',
              show: true,
              page: '/send/go/leaders'
            },
            {
              title: 'Nueva Célula',
              show: true,
              page: '/send/go/new'
            },
            {
              title: 'Seguimiento Semanal',
              show: true,
              page: '/send/go/home'
            },
          ],
        },
        {
          title: 'Reportes Célula',
          show: true,
          bullet: 'dot',
          svg: './assets/media/svg/icons/Navigation/Up-down.svg',
          page: '/send/report/home'
        }
      ]
    }
  ]
};
