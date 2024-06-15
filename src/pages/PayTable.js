import React, { useState, useRef } from 'react';
import { Table, Button, Tooltip } from 'antd';
import { useGetPaymentsQuery } from '../context/clinicApi';
import moment from 'moment';
import { UpOutlined, DownOutlined } from '@ant-design/icons';

const PayTable = () => {
    const { data: clinicBalance, error: clinicBalanceError, isLoading: clinicBalanceLoading } = useGetPaymentsQuery();
    const [currentMonth, setCurrentMonth] = useState(moment().startOf('month'));
    const tableRef = useRef(null);

    // Uzbek tilida oylar nomi
    const uzbekMonths = [
        'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun',
        'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
    ];


    // Hozirgi oydagi datalarni olish
    const currentMonthData = clinicBalance ? clinicBalance.filter(payment =>
        moment(payment.formattedPaymentDate, "DD.MM.YYYY").isSame(currentMonth, 'month')
    ) : [];

    // Datalarni teskarisiga o'zgartirish
    const dataSource = currentMonthData.map((payment) => ({
        key: payment._id, // Unikal identifikator sifatida id ni ishlatish
        clinicName: payment.clinicName,
        amount: payment.amount,
        formattedPaymentDate: payment.formattedPaymentDate,
    }));

    // Hozirgi oydagi umumiy summani hisoblash
    const totalAmount = currentMonthData.reduce((total, payment) => total + payment.amount, 0);

    // Tepaga o'tkazish uchun funksiya
    const goToPreviousMonth = () => {
        setCurrentMonth(currentMonth.clone().subtract(1, 'months'));
    };

    // Pastga o'tkazish uchun funksiya
    const goToNextMonth = () => {
        setCurrentMonth(currentMonth.clone().add(1, 'months'));
    };

    // Agar clinicBalance yuklanmagan bo'lsa yoki xatolik bo'lsa
    if (clinicBalanceError) {
        return <p>Xatolik yuz berdi: {clinicBalanceError.message}</p>;
    }

    // Agar ma'lumotlar yuklanmoqda bo'lsa
    if (clinicBalanceLoading) {
        return <p>Ma'lumotlar yuklanmoqda...</p>;
    }

    // Ma'lumotlar uchun ustunlar
    const columns = [
        {
            title: 'Klinik Nomi',
            dataIndex: 'clinicName',
            key: 'clinicName',
        },
        {
            title: 'Summa',
            dataIndex: 'amount',
            key: 'amount',
            render: (amount) => new Intl.NumberFormat('uz-UZ').format(amount) + ' so\'m', // Summani foizga o'zgartirish
        },
        {
            title: 'To\'lov Sanasi',
            dataIndex: 'formattedPaymentDate',
            key: 'formattedPaymentDate',
        },
    ];

    return (
        <div style={{ padding: 10, background: '#fff', minHeight: 520 }}>
            <div style={{ marginBottom: 16, display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                <Tooltip title="Oldingi oy ma'lumotlarini ko'rsatish">
                    <Button
                        type="primary"
                        onClick={goToPreviousMonth}
                        style={{ margin: '0 10px' }}
                        icon={<DownOutlined />}
                    >
                    </Button>
                </Tooltip>

                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
                    {uzbekMonths[currentMonth.month()]} oyining umumiy summasi: {new Intl.NumberFormat('uz-UZ').format(totalAmount)} so'm
                </span>

                <Tooltip title="Keyingi oy ma'lumotlarini ko'rsatish">
                    <Button
                        type="primary"
                        onClick={goToNextMonth}
                        style={{ margin: '0 10px' }} icon={<UpOutlined />}
                        disabled={moment().isSame(currentMonth, 'month')}
                    >
                    </Button>
                </Tooltip>
            </div>

            <div ref={tableRef}>
                <Table size="small" dataSource={dataSource} columns={columns} pagination={false} />
            </div>
        </div>
    );
};

export default PayTable;
