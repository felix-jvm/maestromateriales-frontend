// import '../styles.css'
// import './SideMenu.css'

export default function SideMenu(props) {

 function updateRoute(e,route) {e.preventDefault();props.setSectionFormRoute(route)}

 return (
  <>
        <div id="layoutSidenav">
            <div id="layoutSidenav_nav">
                <nav className="sb-sidenav accordion sb-sidenav-light" id="sidenavAccordion">
                    <div className="sb-sidenav-menu">
                        <div className="sidenav-nav nav sideNavInnerCont">
                            <div className="sb-sidenav-menu-heading">Secciones</div>
                            <a className="nav-link" href="index.html" onClick={(e)=>{updateRoute(e,'/producto')}}>
                                <div className="sb-nav-link-icon"><i className=""></i></div>
                                Producto
                            </a>                            
                            <a className="nav-link" href="index.html" onClick={(e)=>{updateRoute(e,'/categoria')}}>
                                <div className="sb-nav-link-icon"><i className=""></i></div>
                                Categoria
                            </a>
                            <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapseLayouts" aria-expanded="false" aria-controls="collapseLayouts" onClick={(e)=>{updateRoute(e,'/unidadmedida')}}>
                                <div className="sb-nav-link-icon"><i className=""></i></div>
                                Unidad de medida
                                <div className="sb-sidenav-collapse-arrow"><i className=""></i></div>
                            </a>
                            <div className="collapse" id="collapseLayouts" aria-labelledby="headingOne" data-bs-parent="#sidenavAccordion">
                            </div>
                            <a className="nav-link collapsed" href="#" data-bs-toggle="collapse" data-bs-target="#collapsePages" aria-expanded="false" aria-controls="collapsePages" onClick={(e)=>{updateRoute(e,'/estadomaterial')}}>
                                <div className="sb-nav-link-icon"><i className=""></i></div>
                                Estado del material
                                <div className="sb-sidenav-collapse-arrow"><i className=""></i></div>
                            </a>
                            <a className="nav-link" href="charts.html" onClick={(e)=>{updateRoute(e,'/proveedor')}}>
                                <div className="sb-nav-link-icon"><i className=""></i></div>
                                Proveedor
                            </a>
                        </div>
                    </div>
                    <div className="sb-sidenav-footer">
                        <div className="small">Sesión iniciada como:</div>
                        {props.userData.Nombre}
                    </div>
                </nav>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossOrigin="anonymous"></script>
        <script src="js/scripts.js"></script>  
  </>
    
 )}