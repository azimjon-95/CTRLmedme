import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Table, Button, message, Tooltip, Modal } from "antd"; // Modal import qilingan
import {
  useGetAllClinicsQuery,
  useUpdateClinicMutation,
  useDeleteClinicMutation,
  useMarkPaymentMadeMutation,
} from "../../context/doctorApi";
import { EyeTwoTone } from "@ant-design/icons";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import moment from "moment";
import "moment/locale/uz";

// Uzbek tilida manth oy nomlari
moment.locale("uz", {
  months: [
    "Yanvar",
    "Fevral",
    "Mart",
    "Aprel",
    "May",
    "Iyun",
    "Iyul",
    "Avgust",
    "Sentabr",
    "Oktabr",
    "Noyabr",
    "Dekabr",
  ],
});

const ClinicTable = () => {
  const { data: clinics = [], isLoading } = useGetAllClinicsQuery();
  const [updateClinic] = useUpdateClinicMutation();
  const [deleteClinic] = useDeleteClinicMutation();
  const [markPaymentMade] = useMarkPaymentMadeMutation();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [clinicToDelete, setClinicToDelete] = useState(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [clinicToMarkPayment, setClinicToMarkPayment] = useState(null);
  const [blockLoading, setBlockLoading] = useState({});
  const [deleteLoading, setDeleteLoading] = useState({});
  const [paymentLoading, setPaymentLoading] = useState({});
  const [buttonDisabled, setButtonDisabled] = useState({});
  const [paymentDates, setPaymentDates] = useState({});

  const handleBlock = useCallback(
    async (id, blocked) => {
      setBlockLoading((prev) => ({ ...prev, [id]: true }));
      try {
        await updateClinic({ id, clinicData: { blocked: !blocked } });
        message.success(
          `Shifoxona ${blocked ? "blokdan chiqarildi" : "bloklandi"}`
        );
      } catch (error) {
        const errorMessage = error?.data?.message || "Amalda xatolik yuz berdi";
        message.error(errorMessage);
      } finally {
        setBlockLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    [updateClinic]
  );

  const handleDelete = useCallback(
    async (id) => {
      setDeleteLoading((prev) => ({ ...prev, [id]: true }));
      try {
        await deleteClinic(id);
        message.success("Shifoxona o'chirildi");
        setDeleteModalVisible(false);
      } catch (error) {
        const errorMessage =
          error?.data?.message || "O'chirishda xatolik yuz berdi";
        message.error(errorMessage);
      } finally {
        setDeleteLoading((prev) => ({ ...prev, [id]: false }));
      }
    },
    [deleteClinic]
  );

  const handlePaymentMade = useCallback(
    async (id) => {
      setPaymentLoading((prev) => ({ ...prev, [id]: true }));
      try {
        let res = await markPaymentMade(id);
        console.log(res);
        message.success("Tulov amalga oshirildi");
        setButtonDisabled((prev) => ({ ...prev, [id]: true }));
        const currentDate = moment().format("DD-MMMM");
        localStorage.setItem(`paymentMade-${id}-${moment().month()}`, "true");
        localStorage.setItem(
          `paymentDate-${id}-${moment().month()}`,
          currentDate
        );
        setPaymentDates((prev) => ({ ...prev, [id]: currentDate }));
      } catch (error) {
        const errorMessage =
          error?.data?.message || "Tulovda xatolik yuz berdi";
        message.error(errorMessage);
      } finally {
        setPaymentLoading((prev) => ({ ...prev, [id]: false }));
        setPaymentModalVisible(false);
        setClinicToMarkPayment(null);
      }
    },
    [markPaymentMade]
  );

  // useEffect(() => {
  //   const newButtonDisabled = {};
  //   const newPaymentDates = {};
  //   clinics?.data?.forEach((clinic) => {
  //     const month = moment().month();
  //     const key = `paymentMade-${clinic._id}-${month}`;
  //     const dateKey = `paymentDate-${clinic._id}-${month}`;
  //     newButtonDisabled[clinic._id] = localStorage.getItem(key) === "true";
  //     newPaymentDates[clinic._id] = localStorage.getItem(dateKey) || "";
  //   });
  //   setButtonDisabled(newButtonDisabled);
  //   setPaymentDates(newPaymentDates);
  // }, [clinics]);

  useEffect(() => {
    if (!clinics?.data) return; // Add this line to prevent unnecessary updates

    const newButtonDisabled = {};
    const newPaymentDates = {};
    clinics.data.forEach((clinic) => {
      const month = moment().month();
      const key = `paymentMade-${clinic._id}-${month}`;
      const dateKey = `paymentDate-${clinic._id}-${month}`;
      newButtonDisabled[clinic._id] = localStorage.getItem(key) === "true";
      newPaymentDates[clinic._id] = localStorage.getItem(dateKey) || "";
    });

    setButtonDisabled((prev) =>
      JSON.stringify(prev) !== JSON.stringify(newButtonDisabled)
        ? newButtonDisabled
        : prev
    );

    setPaymentDates((prev) =>
      JSON.stringify(prev) !== JSON.stringify(newPaymentDates)
        ? newPaymentDates
        : prev
    );
  }, [clinics]);

  const formatPhoneNumber = useMemo(() => {
    return (phoneNumber) => {
      if (!phoneNumber || typeof phoneNumber !== "string") {
        return phoneNumber; // Return original value or handle as needed
      }
      const parsedNumber = parsePhoneNumberFromString(phoneNumber, "UZ");
      return parsedNumber ? parsedNumber.formatInternational() : phoneNumber;
    };
  }, []);

  const showDeleteModal = useCallback((id) => {
    setClinicToDelete(id);
    setDeleteModalVisible(true);
  }, []);

  const showPaymentModal = useCallback((id) => {
    setClinicToMarkPayment(id);
    setPaymentModalVisible(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setDeleteModalVisible(false);
    setClinicToDelete(null);
  }, []);

  const handleCancelPayment = useCallback(() => {
    setPaymentModalVisible(false);
    setClinicToMarkPayment(null);
  }, []);

  const expandedRowRender = useCallback(
    (record) => {
      const columns = [
        {
          title: "Manzil",
          dataIndex: "address",
          key: "address",
          ellipsis: true,
          render: (address) => (
            <Tooltip title={address}>
              <div
                style={{
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {address}
              </div>
            </Tooltip>
          ),
        },
        {
          title: "Menejer",
          ellipsis: true,
          dataIndex: "manager",
          key: "manager",
        },
        {
          title: "Ish Vaqti",
          ellipsis: true,
          dataIndex: "workTime",
          key: "workTime",
          render: (_, record) =>
            `${record.workStartTime} - ${record.workEndTime}`,
        },
        {
          title: "Login/Parol",
          dataIndex: "login",
          key: "login",
          render: (text, record) => (
            <div style={{ display: "flex", alignItems: "center" }}>
              <span>{text}</span>
              <Tooltip title={record.password} placement="top">
                <EyeTwoTone style={{ marginLeft: 8 }} />
              </Tooltip>
            </div>
          ),
        },
        {
          title: "O'chirish",
          key: "delete",
          render: (_, record) => (
            <Button
              type="primary"
              danger
              loading={deleteLoading[record._id]}
              onClick={() => showDeleteModal(record._id)}
            >
              O'chirish
            </Button>
          ),
        },
      ];

      return (
        <Table
          columns={columns}
          dataSource={[record]} // Pass the record as dataSource to display details for one clinic
          pagination={false}
          rowKey="_id"
        />
      );
    },
    [deleteLoading, showDeleteModal]
  );

  const columns = useMemo(
    () => [
      { title: "Ismi", dataIndex: "name", key: "name", ellipsis: true },
      {
        title: "Aloqa",
        dataIndex: "contacts",
        key: "contacts",
        render: (contacts) =>
          contacts.map((contact) => (
            <div style={{ whiteSpace: "nowrap" }} key={contact}>
              {formatPhoneNumber(contact)}
            </div>
          )),
      },
      {
        title: "Tulov sanasi",
        dataIndex: "paymentDate",
        key: "paymentDate",
        ellipsis: true,
        render: (paymentDate) => {
          const formattedDate = moment(
            paymentDate,
            "DD.MM.YYYY",
            true
          ).isValid()
            ? moment(paymentDate, "DD.MM.YYYY").format("DD-MMMM")
            : moment(paymentDate).format("DD-MMMM");

          return <span>{formattedDate}</span>;
        },
      },
      {
        title: "Oylik tulovi",
        dataIndex: "clinicPrice",
        key: "clinicPrice",
        ellipsis: true,
        render: (clinicPrice) => (
          <span>{clinicPrice?.toLocaleString("uz-UZ")} so'm</span>
        ),
      },
      {
        title: "Bloklash/Blokdan chiqarish",
        key: "block",
        render: (_, record) => (
          <Button
            type="primary"
            danger={record.blocked}
            loading={blockLoading[record._id]}
            onClick={() => handleBlock(record._id, record.blocked)}
          >
            {record.blocked ? "Blokdan chiqarish" : "Bloklash"}
          </Button>
        ),
      },
      {
        title: "Tulov Qilindi",
        key: "payment",
        render: (_, record) => {
          const paymentDate = paymentDates[record._id];
          const buttonContent = (
            <Button
              type="primary"
              disabled={buttonDisabled[record._id]}
              loading={paymentLoading[record._id]}
              onClick={() => showPaymentModal(record._id)}
            >
              Tulov Qilindi
            </Button>
          );

          return buttonDisabled[record._id] ? (
            <Tooltip title={`Tulov sanasi: ${paymentDate}`}>
              {buttonContent}
            </Tooltip>
          ) : (
            buttonContent
          );
        },
      },
    ],
    [
      blockLoading,
      paymentLoading,
      buttonDisabled,
      paymentDates,
      formatPhoneNumber,
      handleBlock,
      showPaymentModal,
    ]
  );

  return (
    <div>
      <Table
        columns={columns}
        loading={isLoading}
        pagination={false}
        size="small"
        rowKey="_id"
        expandable={{
          expandedRowRender,
        }}
        dataSource={clinics?.data}
      />
      <Modal
        title="Shifoxonani o'chirish"
        open={deleteModalVisible}
        onOk={() => handleDelete(clinicToDelete)}
        onCancel={handleCancelDelete}
        okText="OK"
        cancelText="Cancel"
      >
        <p>Shifoxonani o'chirishni tasdiqlaysizmi?</p>
      </Modal>
      <Modal
        title="Tulovni tasdiqlash"
        open={paymentModalVisible}
        onOk={() => handlePaymentMade(clinicToMarkPayment)}
        onCancel={handleCancelPayment}
        okText="OK"
        cancelText="Cancel"
      >
        <p>Tulovni tasdiqlaysizmi?</p>
      </Modal>
    </div>
  );
};

export default ClinicTable;





