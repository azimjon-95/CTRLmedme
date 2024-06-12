import React from 'react';
import { Table, Button, message, Tooltip } from 'antd';
import {
    useGetAllClinicsQuery,
    useBlockClinicMutation,
    useUnblockClinicMutation,
    useDeleteClinicMutation,
    useMarkPaymentMadeMutation
} from '../../context/doctorApi';
import { EyeTwoTone } from '@ant-design/icons';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const ClinicTable = () => {
    const { data: clinics = [], isLoading } = useGetAllClinicsQuery();
    const [blockClinic] = useBlockClinicMutation();
    const [unblockClinic] = useUnblockClinicMutation();
    const [deleteClinic] = useDeleteClinicMutation();
    const [markPaymentMade] = useMarkPaymentMadeMutation();


    const handleBlock = async (id, isBlocked) => {
        try {
            if (isBlocked) {
                let err = await unblockClinic(id);
                console.log(err);
                message.success('Klinika blokdan chiqarildi');
            } else {
                let err = await blockClinic(id);
                console.log(err);

                message.success('Klinika bloklandi');
            }
        } catch (error) {
            message.error('Amalda xatolik yuz berdi');
        }
    };

    const handleDelete = async (id) => {
        console.log(id);
        try {
            await deleteClinic(id);
            message.success('Klinika o\'chirildi');
        } catch (error) {
            message.error('O\'chirishda xatolik yuz berdi');
        }
    };

    const handlePaymentMade = async (id) => {
        try {
            let err = await markPaymentMade(id);
            console.log(err);
            message.success('Tulov amalga oshirildi');
        } catch (error) {
            message.error('Tulovda xatolik yuz berdi');
        }
    };

    const formatPhoneNumber = (phoneNumber) => {
        const parsedNumber = parsePhoneNumberFromString(phoneNumber, 'UZ');
        return parsedNumber ? parsedNumber.formatInternational() : phoneNumber;
    };

    const columns = [
        { title: 'Ismi', dataIndex: 'name', key: 'name', ellipsis: true },
        {
            title: 'Manzil', dataIndex: 'address', key: 'address', ellipsis: true,
            render: address => (
                <Tooltip title={address}>
                    <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {address}
                    </div>
                </Tooltip>
            ),
        },
        {
            title: 'Aloqa',
            dataIndex: 'contacts',
            key: 'contacts',
            render: (contacts) => contacts.map(contact => (
                <div style={{ whiteSpace: 'nowrap' }} key={contact}>{formatPhoneNumber(contact)}</div>
            ))
        },
        { title: 'Menejer', ellipsis: true, dataIndex: 'manager', key: 'manager' },
        { title: 'Ish Vaqti', ellipsis: true, dataIndex: 'workTime', key: 'workTime', render: (_, record) => `${record.workStartTime} - ${record.workEndTime}` },
        {
            title: 'Login/Parol',
            dataIndex: 'login',
            key: 'login',
            render: (text, record) => (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>{text}</span>
                    <Tooltip title={record.password} placement="top">
                        <EyeTwoTone style={{ marginLeft: 8 }} />
                    </Tooltip>
                </div>
            )
        },
        {
            title: 'Bloklash/Blokdan chiqarish',
            key: 'block',
            render: (_, record) => (
                <Button type="primary" danger={record.blocked} onClick={() => handleBlock(record._id, record.blocked)}>
                    {record.blocked ? 'Blokdan chiqarish' : 'Bloklash'}
                </Button>
            )
        },
        {
            title: 'O\'chirish',
            key: 'delete',
            render: (_, record) => (
                <Button type="primary" danger onClick={() => handleDelete(record._id)}>
                    O'chirish
                </Button>
            )
        },
        {
            title: 'Tulov Qilindi',
            key: 'payment',
            render: (_, record) => (
                <Button type="primary" onClick={() => handlePaymentMade(record._id)}>
                    Tulov Qilindi
                </Button>
            )
        }
    ];

    return (
        <div>
            <style jsx>{`
                .ant-table {
                    font-size: 12px; /* Barcha matnlar uchun font o'lchami */
                }
                .eye-icon-hover {
                    display: none;
                }
                .eye-icon:hover + .eye-icon-hover {
                    display: inline-block;
                }
                .eye-icon:hover {
                    display: none;
                }
                .ant-table-thead > tr > th {
                    font-size: 12px; /* Jadval sarlavhalari uchun font o'lchami */
                }
                .ant-table-tbody > tr > td {
                    font-size: 12px; /* Jadval qatorlari uchun font o'lchami */
                }
                .ant-btn {
                    font-size: 12px; /* Tugmalar uchun font o'lchami */
                }
            `}</style>
            <Table loading={isLoading} pagination={false} size="small" dataSource={clinics?.data} columns={columns} rowKey="_id" />
        </div>
    );
};

export default ClinicTable;






// import React from 'react';
// import { Table, Spin, Alert, Button } from 'antd';
// import { useGetAllClinicsQuery } from '../../context/doctorApi';
// import MainLayout from '../../home/Home';

// const ClinicTable = () => {
//     const { data: clinics, error, isLoading } = useGetAllClinicsQuery();
//     // if (isLoading) return <Spin />;
//     // if (error) return <Alert message="Error" type="error" />;

//     const columns = [
//         { title: 'Ismi', dataIndex: 'name', key: 'name' },
//         { title: 'Manzil', dataIndex: 'address', key: 'address' },
//         { title: 'Aloqa', dataIndex: 'contact', key: 'contact' },
//         { title: 'Menejer', dataIndex: 'manager', key: 'manager' },
//         { title: 'Xizmatlar', dataIndex: 'services', key: 'services' },
//         { title: 'Litsenziyalar', dataIndex: 'licenses', key: 'licenses' },
//         { title: 'Xodimlar', dataIndex: 'staff', key: 'staff' },
//         { title: 'Uskunalar', dataIndex: 'equipment', key: 'equipment' },
//         { title: 'Soliq Hisoboti', dataIndex: 'taxReport', key: 'taxReport' },
//         { title: 'Davlat Hujjatlari', dataIndex: 'stateDocuments', key: 'stateDocuments' },
//         { title: 'Ish Vaqti', dataIndex: 'workTime', key: 'workTime' },
//         { title: 'Login', dataIndex: 'login', key: 'login' },
//         {
//             title: 'Bloklash',
//             dataIndex: 'userType',
//             key: 'userType',
//             render: (_, record) => (
//                 <Button type="primary" danger onClick={() => handleBlock(record.key)}>
//                     Bloklash
//                 </Button>
//             )
//         },
//         {
//             title: 'O\'chirish',
//             dataIndex: 'clear',
//             key: 'clear',
//             render: (_, record) => (
//                 <Button type="primary" onClick={() => handleClear(record.key)}>
//                     O'chirish
//                 </Button>
//             )
//         }
//     ];
//     // Dummy data for the table
//     const data = [
//         {
//             key: '1',
//             name: 'Klinika 1',
//             address: 'Manzil 1',
//             contact: 'Aloqa 1',
//             manager: 'Menejer 1',
//             services: 'Xizmatlar 1',
//             licenses: 'Litsenziyalar 1',
//             staff: 'Xodimlar 1',
//             equipment: 'Uskunalar 1',
//             taxReport: 'Soliq Hisoboti 1',
//             stateDocuments: 'Davlat Hujjatlari 1',
//             workTime: 'Ish Vaqti 1',
//             login: 'Login 1',
//             userType: 'Admin',
//             clear: 'Clear'
//         }
//         // Yana boshqa ma'lumotlar qo'shishingiz mumkin
//     ];
//     // Bloklash uchun funksiya
//     const handleBlock = (key) => {
//         console.log('Bloklash bosildi, ID:', key);
//         // Bloklash logikasini bu yerga qo'shing
//     };

//     // O'chirish uchun funksiya
//     const handleClear = (key) => {
//         console.log('O\'chirish bosildi, ID:', key);
//         // O'chirish logikasini bu yerga qo'shing
//     };

//     return (
//         <div >
//             <MainLayout>
//                 <Table size="small" dataSource={data} columns={columns} rowKey="_id" />
//             </MainLayout>
//         </div>
//     )
// };

// export default ClinicTable;
