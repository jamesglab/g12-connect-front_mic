export let DynamicAsideMenuConfigOriginal = {
  items: [
    {
      title: 'Tablero',
      root: true,
      show:false,
      code: "DB000",
      svg: './assets/media/svg/icons/Design/PenAndRuller.svg',
      page: '/dashboard',
      translate: 'MENU.DASHBOARD',
      bullet: 'dot',
    },
    {
      title: 'Administración',
      root: true,
      show:false,
      code: "ADM000",
      icon: 'flaticon2-architecture-and-city',
      svg: './assets/media/svg/icons/General/Settings-2.svg',
      bullet: 'dot',
      page: '/admin',
      submenu: [
        {
          title: 'Gestión Permisos',
          bullet: 'dot',
          show:false,
          code: "ADM010",
          submenu: [
            {
              title: 'Usuarios',
              root: true,
              show:false,
              bullet: 'dot',
              code: "ADM011",
              page: '/admin/permisses/users'
            },
            {
              title: 'Roles',
              root: true,
              show:false,
              bullet: 'dot',
              code: "ADM012",
              page: '/admin/permisses/roles'
            },
            {
              title: 'Objetos',
              root: true,
              show:false,
              bullet: 'dot',
              code: "ADM013",
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
      show:false,
      submenu: [
        {
          title: 'Dashboard',
          root: true,
          show:false,
          bullet: 'dot',
          code: "DO010",
          page: '/donations/dashboard'
        },
        {
          title: 'Reportes',
          root: true,
          show:false,
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
      svg: './assets/media/svg/icons/Shopping/Ticket.svg',
      page: '/g12events',
      show:false,
      submenu: [
        {
          title: 'Inicio',
          root: true,
          show:false,
          bullet: 'dot',
          code: "EVT010",
          page: '/g12events/home'
        },
        {
          title: 'Nuevo Evento',
          root: true,
          show:false,
          bullet: 'dot',
          code: "EVT020",
          page: '/g12events/add'
        },
        {
          title: 'Reportes',
          root: true,
          show:false,
          bullet: 'dot',
          code: "EVT030",
          page: '/g12events/reports'
        },
        {
          title: 'Usuarios',
          root: true,
          show:false,
          bullet: 'dot',
          code: "EVT030",
          page: '/g12events/users'
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
      show:false,
      code: "G000",
      bullet: 'dot',
      page: '/to-win',
      svg: './assets/media/svg/icons/Design/Cap-3.svg',
      submenu: [
        {
          title: 'Personas',
          bullet: 'dot',
          show:false,
          code: "G010",
          submenu: [
            {
              title: 'Registrar Nueva',
              page: '/to-win/people/new',
              show:false,
              code: "G011",
            },
            {
              title: 'Buscar Persona',
              page: '/to-win/people/search',
              show:false,
              code: "G012"
            }
          ]
        },
        {
          title: 'Fono Visita',
          root: true,
          show:false,
          code: "G020",
          bullet: 'dot',
          page: '/to-win/phone-visit'
        },
        {
          title: 'Reportes Ganar',
          root: true,
          show:false,
          code: "G030",
          bullet: 'dot',
          page: '/to-win/reports',
        }
      ]
    },
    {
      title: 'Enviar',
      root: true,
      show:false,
      code: "ENV000",
      bullet: 'dot',
      page: '/send',
      icon: 'flaticon2-browser-2',
      svg: './assets/media/svg/icons/Design/Cap-2.svg',
      submenu: [
        {
          title: 'Gestión Célula',
          bullet: 'dot',
          show:false,
          code: "ENV010",
          submenu: [
            {
              title: 'Lideres',
              page: '/send/go/leaders',
              show:false,
              code: "ENV011"
            },
            {
              title: 'Nueva Célula',
              page: '/send/go/new',
              show:false,
              code: "ENV012"
            },
            {
              title: 'Seguimiento Semanal',
              page: '/send/go/home',
              show:false,
              code: "ENV013"
            }
          ]
        },
        {
          title: 'Reportes Célula',
          root: true,
          bullet: 'dot',
          page: '/send/report/home',
          show:false,
          code: "ENV020"
        }

      ]
    },
    {
      title: 'Usuarios',
      root: true,
      code: "EVT000",
      alignment: 'left',
      page: '/ministerial-info',
      show: false,
    }
  ]
};
