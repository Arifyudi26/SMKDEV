/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import PaginationComponent from "@/app/components/pagination/Pagination";
import TableComponent from "@/app/components/table/table";
import { Button, Modal, Form, Input, InputNumber, Tag } from "antd";
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "@/app/hooks/useProducts";
import Swal from "sweetalert2";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Product, ProductFormData } from "../lib/type";

function ProductPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const { data, isLoading, error } = useProducts(currentPage, limit);

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const handlePageChange = (page: number, limit: number) => {
    setCurrentPage(page);
    setLimit(limit);
  };

  const showModal = (product: Product | null = null) => {
    setIsEditMode(!!product);
    setEditingProduct(product);
    form.resetFields();

    if (product) {
      const newData: ProductFormData = {
        name: product.name,
        price: product.fix_price,
        category: product.farmalkes_type.name,
        manufacturer: product.manufacturer,
        registrar: product.registrar,
        net_weight: product.net_weight,
        dosage_form: product.dosage_form.name,
        state: product.state,
      };

      form.setFieldsValue(newData);
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const generateKfaCode = () => {
    return `KFA-${Date.now()}`;
  };

  const handleCreateProduct = async () => {
    try {
      const values = await form.validateFields();

      const newData = {
        ...editingProduct,
        ...values,
        fix_price: values.price,
        dosage_form: {
          ...editingProduct?.dosage_form,
          name: values.dosage_form,
        },
        farmalkes_type: {
          ...editingProduct?.farmalkes_type,
          name: values.category,
        },
        kfa_code: generateKfaCode(),
        net_weight_uom_name: "g",
      };

      createProductMutation.mutate(newData, {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Product Created Successfully",
            text: "The product has been successfully created!",
          });
          setIsModalVisible(false);
          form.resetFields();
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Failed to Create Product",
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

  const handleUpdateProduct = async () => {
    try {
      const values = await form.validateFields();
      const newData = {
        ...editingProduct,
        ...values,
        fix_price: values.price,
        dosage_form: {
          ...editingProduct?.dosage_form,
          name: values.dosage_form,
        },
        farmalkes_type: {
          ...editingProduct?.farmalkes_type,
          name: values.category,
        },
      };

      updateProductMutation.mutate(newData, {
        onSuccess: () => {
          Swal.fire({
            icon: "success",
            title: "Product Updated Successfully",
            text: "The product has been successfully updated!",
          });
          setIsModalVisible(false);
          form.resetFields();
        },
        onError: (error) => {
          Swal.fire({
            icon: "error",
            title: "Failed to Update Product",
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

  const handleDeleteProduct = (productId: string) => {
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
        deleteProductMutation.mutate(productId, {
          onSuccess: () => {
            Swal.fire({
              icon: "success",
              title: "Product Deleted Successfully",
              text: "The product has been successfully deleted!",
            });
          },
          onError: (error) => {
            Swal.fire({
              icon: "error",
              title: "Failed to Delete Product",
              text: `Error: ${error.message}`,
            });
          },
        });
      }
    });
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
    },
    {
      title: "KFA Code",
      dataIndex: "kfa_code",
    },
    {
      title: "Active Ingredients",
      dataIndex: "active_ingredients",
      render: (ingredients: any) => {
        return (
          ingredients &&
          ingredients.map((ingredient: any) => (
            <Tag key={ingredient.kfa_code}>{ingredient.zat_aktif}</Tag>
          ))
        );
      },
    },
    {
      title: "Manufacturer",
      dataIndex: "manufacturer",
    },
    {
      title: "Registrar",
      dataIndex: "registrar",
    },
    {
      title: "Dosage Form",
      render: (record: any) => {
        return record.dosage_form.name;
      },
    },
    {
      title: "Net Weight",
      dataIndex: "net_weight",
      render: (text: any, record: any) => {
        return `${text || 0} ${record?.net_weight_uom_name}`;
      },
    },
    {
      title: "Price",
      dataIndex: "fix_price",
      render: (record: any) => (record ? `Rp ${record}` : "-"),
    },
    {
      title: "State",
      dataIndex: "state",
    },
    {
      title: "Category",
      render: (record: any) => {
        return record.farmalkes_type.name;
      },
    },
    {
      title: "Actions",
      render: (record: any) => {
        return (
          <div style={{ width: "5em" }}>
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
              onClick={() => handleDeleteProduct(record.id)}
            />
          </div>
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
        onOk={isEditMode ? handleUpdateProduct : handleCreateProduct}
        onCancel={handleCancel}
        okText={isEditMode ? "Update" : "Create"}
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical" name="productForm">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[
              { required: true, message: "Please input the product name!" },
            ]}
          >
            <Input defaultValue={editingProduct?.name} />
          </Form.Item>
          <Form.Item
            name="price"
            label="Price"
            rules={[{ required: true, message: "Please input the price!" }]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Enter price"
              defaultValue={editingProduct?.fix_price ?? 0}
            />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: "Please input the category!" }]}
          >
            <Input defaultValue={editingProduct?.farmalkes_type?.name ?? ""} />
          </Form.Item>
          <Form.Item
            name="manufacturer"
            label="Manufacturer"
            rules={[
              { required: true, message: "Please input the manufacturer!" },
            ]}
          >
            <Input defaultValue={editingProduct?.manufacturer} />
          </Form.Item>
          <Form.Item
            name="registrar"
            label="Registrar"
            rules={[{ required: true, message: "Please input the registrar!" }]}
          >
            <Input defaultValue={editingProduct?.registrar} />
          </Form.Item>
          <Form.Item
            name="dosage_form"
            label="Dosage Form"
            rules={[
              { required: true, message: "Please input the dosage form!" },
            ]}
          >
            <Input defaultValue={editingProduct?.dosage_form?.name ?? ""} />
          </Form.Item>
          <Form.Item
            name="net_weight"
            label="Net Weight"
            rules={[
              { required: true, message: "Please input the net weight!" },
            ]}
          >
            <InputNumber
              min={0}
              style={{ width: "100%" }}
              placeholder="Enter net weight"
              defaultValue={editingProduct?.net_weight}
            />
          </Form.Item>
          <Form.Item
            name="state"
            label="State"
            rules={[{ required: true, message: "Please input the state!" }]}
          >
            <Input defaultValue={editingProduct?.state} />
          </Form.Item>
        </Form>
      </Modal>

      <h1>Products</h1>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginTop: 10, marginBottom: 10 }}
      >
        Create Product
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

export default ProductPage;
