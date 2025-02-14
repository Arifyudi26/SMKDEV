/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import PaginationComponent from "@/app/components/pagination/Pagination";
import TableComponent from "@/app/components/table/table";
import { Button, Modal, Form, Input } from "antd";
import {
  useUsers,
  useCreateUser,
  useUpdateUser,
  useDeleteUser,
} from "@/app/hooks/useUsers";
import Swal from "sweetalert2";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Product } from "../lib/type";
import Image from "next/image";

function UserPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<Product | null>(null);

  const [form] = Form.useForm();

  const { data, isLoading, error } = useUsers(currentPage, limit);

  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handlePageChange = (page: number, limit: number) => {
    setCurrentPage(page);
    setLimit(limit);
  };

  const showModal = (user = null) => {
    setIsEditMode(!!user);
    setEditingUser(user);
    form.resetFields();
    if (user) {
      form.setFieldsValue(user);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCreateUser = async () => {
    try {
      const values = await form.validateFields();

      createUserMutation.mutate(values, {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "User Created Successfully",
            text: "The User has been successfully created!",
          });
          setIsModalVisible(false);
          form.resetFields();
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Failed to Create user",
            text: `Error: ${error.message}`,
          });
        },
      });
    } catch (err) {
      console.log("Form validation error:", err);
      Swal.fire({
        icon: "error",
        title: "Validation Failed",
        text: "Please complete all required fields.",
      });
    }
  };

  const handleUpdateUser = async () => {
    try {
      const values = await form.validateFields();
      const updatedUser = { ...editingUser, ...values };

      updateUserMutation.mutate(updatedUser, {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "User Updated Successfully",
            text: "The User has been successfully updated!",
          });
          setIsModalVisible(false);
          form.resetFields();
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Failed to Update User",
            text: `Error: ${error.message}`,
          });
        },
      });
    } catch (err) {
      console.log("Form validation error:", err);
      Swal.fire({
        icon: "error",
        title: "Validation Failed",
        text: "Please complete all required fields.",
      });
    }
  };

  const handleDeleteUser = (userId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteUserMutation.mutate(userId, {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "User Deleted Successfully",
              text: "The user has been successfully deleted!",
            });
          },
          onError: (error) => {
            Swal.fire({
              icon: "error",
              title: "Failed to Delete User",
              text: `Error: ${error.message}`,
            });
          },
        });
      }
    });
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      render: (record: string) => (
        <Image
          src={record || "https://randomuser.me/api/portraits/men/1.jpg"}
          alt="Profile"
          width={50}
          height={50}
          style={{ borderRadius: "50%" }}
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Actions",
      render: (record: any) => {
        return (
          <>
            <Button
              type="primary"
              icon={<EditOutlined />}
              style={{ marginRight: 5 }}
              onClick={() => showModal(record)}
            />
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDeleteUser(record.id)}
            />
          </>
        );
      },
    },
  ];

  if (error) return <div>Error loading products</div>;

  return (
    <div>
      <Modal
        title={isEditMode ? "Edit Product" : "Create Product"}
        open={isModalVisible}
        onOk={isEditMode ? handleUpdateUser : handleCreateUser}
        onCancel={handleCancel}
        okText={isEditMode ? "Update" : "Create"}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="productForm">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please input the user name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please input the user Email!" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <h1>Users</h1>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        Create User
      </Button>

      <TableComponent
        data={data?.data || []}
        columns={columns}
        isLoading={isLoading}
      />

      <PaginationComponent
        currentPage={currentPage}
        pageSize={limit}
        totalItems={data?.totalItems || 0}
        onChange={handlePageChange}
      />
    </div>
  );
}

export default UserPage;
