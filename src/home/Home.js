import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { Layout, Menu, Modal } from 'antd';
import { UserOutlined, AppstoreOutlined, LogoutOutlined } from '@ant-design/icons';
import { BiClinic } from "react-icons/bi";
import Logo from '../img/LogoOneMed.png';
import { useGetClinicBalanceQuery } from '../context/clinicApi';

const { Header, Content, Sider } = Layout;

const MainLayout = ({ handleLogout }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const location = useLocation();

    // Fetch clinic balance data
    const { data: clinicBalance, error: clinicBalanceError, isLoading: clinicBalanceLoading } = useGetClinicBalanceQuery();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
        handleLogout();
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    // Ensure clinicBalance is an array and has at least one element
    const clinicBalanceObject = Array.isArray(clinicBalance) && clinicBalance.length > 0 ? clinicBalance[0] : null;

    // Format the balance with commas
    const formattedBalance = clinicBalanceObject ?
        new Intl.NumberFormat('en-US').format(clinicBalanceObject.balanc) :
        null;

    return (
        <Layout style={{ minHeight: '100vh', overflow: "hidden" }}>
            <Sider collapsible>
                <div style={{ height: "63px", display: "flex", alignItems: "center", paddingLeft: "30px" }}>
                    <img width={100} src={Logo} alt="Logo" />
                </div>
                <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} defaultSelectedKeys={['2']}>
                    <Menu.Item style={{ background: "#060079" }} key="/clinic_table" >
                        <Link to="/clinic_table">
                            <div className="demo-logo-vertical">
                                <div className="demo-logo-box">
                                    <b style={{ marginTop: "15px" }}>
                                        {clinicBalanceLoading && <p>Loading...</p>}
                                        {!clinicBalanceLoading && clinicBalanceObject ? (
                                            <p>Balans: {formattedBalance} so'm</p>
                                        ) : clinicBalanceError ? (
                                            <p>Error: {clinicBalanceError.message}</p>
                                        ) : (
                                            <p>Balans: Mavjud emas</p>
                                        )}
                                    </b>
                                </div>
                            </div>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/clinics" icon={<AppstoreOutlined />}>
                        <Link to="/clinics">Klinikalar jadvali</Link>
                    </Menu.Item>
                    <Menu.Item key="/register" icon={<BiClinic />}>
                        <Link to="/register">Klinikani Ro'yxatga olish</Link>
                    </Menu.Item>
                    <Menu.Item key="/create_admin" icon={<UserOutlined />}>
                        <Link to="/create_admin">Admindi Ro'yxatga olish</Link>
                    </Menu.Item>

                    <Menu.Item icon={<LogoutOutlined />} key="logout" onClick={showModal}>
                        Chiqish
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0, textAlign: 'center', color: 'white' }}>
                    <h1>Klinik boshqaruv tizimi</h1>
                </Header>
                <Content>
                    <div style={{ padding: 10, background: '#fff', minHeight: 520 }}>
                        <Outlet />
                    </div>
                </Content>
            </Layout>
            <Modal
                title="Chiqish"
                visible={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="OK"
                cancelText="NO"
            >
                <p>Chiqishni istaysizmi?</p>
            </Modal>
        </Layout >
    );
};

export default MainLayout;


// import React, { useState } from 'react';
// import { Link, Outlet, useLocation } from 'react-router-dom';
// import { Layout, Menu, Modal } from 'antd';
// import { UserOutlined, AppstoreOutlined, LogoutOutlined } from '@ant-design/icons';
// import { BiClinic } from "react-icons/bi";
// import Logo from '../img/LogoOneMed.png';
// import { useGetClinicBalanceQuery } from '../context/clinicApi';

// const { Header, Content, Sider } = Layout;

// const MainLayout = ({ handleLogout }) => {
//     const [isModalVisible, setIsModalVisible] = useState(false);
//     const location = useLocation();
//     // Fetch clinic balance data
//     const { data: clinicBalance, error: clinicBalanceError, isLoading: clinicBalanceLoading } =
//         useGetClinicBalanceQuery();

//     const showModal = () => {
//         setIsModalVisible(true);
//     };

//     const handleOk = () => {
//         setIsModalVisible(false);
//         handleLogout();
//     };

//     const handleCancel = () => {
//         setIsModalVisible(false);
//     };

//     console.log(clinicBalance, clinicBalanceError);

//     return (
//         <Layout style={{ minHeight: '100vh', overflow: "hidden" }}>
//             <Sider collapsible>
//                 <div style={{ height: "63px", display: "flex", alignItems: "center", paddingLeft: "30px" }}>
//                     <img width={100} src={Logo} alt="Logo" />
//                 </div>
//                 <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} defaultSelectedKeys={['2']}>
//                     <div className="demo-logo-vertical" >
//                         <div className="demo-logo-box">
//                             {clinicBalanceLoading && <p>Loading...</p>}
//                             {clinicBalance && clinicBalance.data && (
//                                 <p>Balance: {clinicBalance.data.balanc}</p>
//                             )}
//                             {clinicBalanceError && <p>Error: {clinicBalanceError.message}</p>}
//                         </div>
//                     </div>
//                     <Menu.Item key="/clinics" icon={<AppstoreOutlined />}>
//                         <Link to="/clinics">Klinikalar jadvali</Link>
//                     </Menu.Item>
//                     <Menu.Item key="/register" icon={<BiClinic />}>
//                         <Link to="/register">Klinikani Ro'yxatga olish</Link>
//                     </Menu.Item>
//                     <Menu.Item key="/create_admin" icon={<UserOutlined />}>
//                         <Link to="/create_admin">Admindi Ro'yxatga olish</Link>
//                     </Menu.Item>
//                     <Menu.Item icon={<LogoutOutlined />} key="logout" onClick={showModal}>
//                         Chiqish
//                     </Menu.Item>
//                 </Menu>
//             </Sider>
//             <Layout className="site-layout">
//                 <Header className="site-layout-background" style={{ padding: 0, textAlign: 'center', color: 'white' }}>
//                     <h1>Klinik boshqaruv tizimi</h1>
//                 </Header>
//                 <Content>
//                     <div style={{ padding: 10, background: '#fff', minHeight: 520 }}>
//                         <Outlet />
//                     </div>
//                 </Content>
//             </Layout>
//             <Modal
//                 title="Chiqish"
//                 visible={isModalVisible}
//                 onOk={handleOk}
//                 onCancel={handleCancel}
//                 okText="OK"
//                 cancelText="NO"
//             >
//                 <p>Chiqishni istaysizmi?</p>
//             </Modal>
//         </Layout>
//     );
// };

// export default MainLayout;
