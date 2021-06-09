export const DynamicAsideMenuConfig = {
  items: [
    {
      title: 'Tablero',
      root: true,
      show: true,
      code: "DB000",
      svg: './assets/media/svg/icons/Design/PenAndRuller.svg',
      page: '/dashboard',
      translate: 'MENU.DASHBOARD',
      bullet: 'dot',
    },
    {
      title: 'Administración',
      root: true,
      show: true,
      code: "ADM000",
      icon: 'flaticon2-architecture-and-city',
      svg: './assets/media/svg/icons/General/Settings-2.svg',
      bullet: 'dot',
      page: '/admin',
      submenu: [
        {
          title: 'Gestión Permisos',
          bullet: 'dot',
          show: true,
          submenu: [
            {
              title: 'Usuarios',
              root: true,
              show: true,
              bullet: 'dot',
              page: '/admin/permisses/users'
            },
            {
              title: 'Roles',
              root: true,
              show: true,
              bullet: 'dot',
              page: '/admin/permisses/roles'
            },
            {
              title: 'Objetos',
              root: true,
              show: true,
              bullet: 'dot',
              page: '/admin/permisses/objects'
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
      svg: './assets/media/svg/icons/Shopping/Dollar.svg',
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
      svg: './assets/media/svg/icons/Shopping/Ticket.svg',
      page: '/g12events',
      show: true,
      submenu: [
        {
          title: 'Inicio',
          root: true,
          show: true,
          bullet: 'dot',
          page: '/g12events/home'
        },
        {
          title: 'Nuevo Evento',
          root: true,
          show: true,
          bullet: 'dot',
          page: '/g12events/add'
        },
        {
          title: 'Reportes',
          root: true,
          show: true,
          bullet: 'dot',
          page: '/g12events/reports'
        }
      ]
    },
    // {
    //   title: 'Mi perfil',
    //   root: true,
    //   show: false,
    //   page: '/profile',
    //   bullet: 'dot'
    // },
    { section: 'Visión G12' },
    {
      title: 'Ganar',
      root: true,
      show: true,
      code: "G000",
      bullet: 'dot',
      page: '/to-win',
      svg: './assets/media/svg/icons/Design/Cap-3.svg',
      submenu: [
        {
          title: 'Personas',
          bullet: 'dot',
          show: true,
          code: "G001",
          submenu: [
            {
              title: 'Registrar Nueva',
              page: '/to-win/people/new',
              show: true
            },
            {
              title: 'Buscar Persona',
              page: '/to-win/people/search',
              show: true
            }
          ]
        },
        {
          title: 'Fono Visita',
          root: true,
          show: true,
          code: "G002",
          bullet: 'dot',
          page: '/to-win/phone-visit'
        },
        {
          title: 'Reportes Ganar',
          root: true,
          show: true,
          code: "G004",
          bullet: 'dot',
          page: '/to-win/reports',
        }
      ]
    },
    {
      title: 'Enviar',
      root: true,
      show: true,
      code: "ENV000",
      bullet: 'dot',
      page: '/send',
      icon: 'flaticon2-browser-2',
      svg: './assets/media/svg/icons/Design/Cap-2.svg',
      submenu: [
        {
          title: 'Gestión Célula',
          bullet: 'dot',
          show: true,
          submenu: [
            {
              title: 'Lideres',
              page: '/send/go/leaders',
              show: true
            },
            {
              title: 'Nueva Célula',
              page: '/send/go/new',
              show: true
            },
            {
              title: 'Seguimiento Semanal',
              page: '/send/go/home',
              show: true
            }
          ]
        },
        {
          title: 'Reportes Célula',
          root: true,
          bullet: 'dot',
          page: '/send/report/home',
          show: true
        }

      ]
    }
  ]
};
