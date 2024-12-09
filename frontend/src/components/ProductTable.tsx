import React, { useEffect, useState } from "react";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Select,
  MenuItem,
  Checkbox,
  Table,
  IconButton,
  FormControl,
  InputLabel,
  ListItemText,
} from "@mui/material";
import { Product, Units } from "../types/Catalog";
import styled from "styled-components";
import IPageWrapper from "./IPageWrapper";
import { BackOfficeApiService } from "../services/back-office-api.service";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Store } from "./DistributionPointsTable";
import { useLocation } from "react-router-dom";

const ProductTable = () => {
  const [rows, setRows] = useState<Product[]>([]);
  const [newRow, setNewRow] = useState<Product>({
    id: 0,
    name: "",
    image: "",
    price: 0,
    status: false,
    unit: Units.kg,
    disabledStoresIds: [],
  });
  const [editingRow, setEditingRow] = useState<number | null>(null);
  const [tempRowData, setTempRowData] = useState<any>();
  const apiService = new BackOfficeApiService();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [distributionPoints, setDistributionPoints] = useState<Store[]>([]);
  const [selectedDistributionPoints, setSelectedDistributionPoints] = useState<
    Store[]
  >([]);
  const location = useLocation();
  const accountUrl = location.pathname.split("/")[1];

  useEffect(() => {
    getProduct();
    getDistributionPoints();
  }, []);

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index?: number
  ) => {
    if (event.target.files) {
      const file = event.target.files[0];
      if (index != undefined && index >= 0) {
        const updatedTempRowData: Partial<Product> = {
          ...tempRowData,
          image: file,
          imagePreviewUrl: URL?.createObjectURL(file),
        };
        setTempRowData(updatedTempRowData);
      } else {
        const newRowImageData = {
          image: file,
          imagePreviewUrl: URL?.createObjectURL(file),
        };

        setNewRow({ ...newRow, ...newRowImageData });
      }
    }
  };

  const handleRemoveImage = async (index?: number) => {
    if (index != undefined && index >= 0) {
      const updatedTempRowData = {
        ...tempRowData,
        image: null,
        imagePreviewUrl: null,
      };
      setTempRowData(updatedTempRowData);
    } else {
      setNewRow({ ...newRow, image: null, imagePreviewUrl: null });
    }
    setSelectedImage(null);
  };

  const handleAddRow = async () => {
    try {
      const formData = new FormData();
      formData.append("name", newRow.name);
      formData.append("price", newRow.price.toString());
      formData.append("status", newRow.status ? "true" : "false");
      formData.append("unit", newRow.unit);
      formData.append(
        "disabledStoresIds",
        JSON.stringify(newRow.disabledStoresIds)
      );
      if (newRow.image) formData.append("image", newRow.image);

      const response = await apiService.products.createProduct(formData);
      if (response) {
        setRows([...rows, newRow]);
        setNewRow({
          id: 0,
          name: "",
          image: "",
          price: 0,
          status: false,
          unit: Units.kg,
          disabledStoresIds: [],
        });
        setSelectedImage(null);
        toast.success("מוצר נוצר בהצלחה");
      } else {
        toast.error("הוספת מוצר נכשלה, אנא נסה נסית במועד מאוחר יותר");
      }
    } catch (e) {
      toast.error("הוספת מוצר נכשלה, אנא נסה נסית במועד מאוחר יותר");
      console.error("Error creating product:", e);
    }
  };

  const handleSaveRow = async () => {
    try {
      if (editingRow !== null && tempRowData) {
        const formData = new FormData();
        formData.append("name", tempRowData.name);
        formData.append("price", tempRowData.price.toString());
        formData.append("status", tempRowData.status ? "true" : "false");
        formData.append("unit", tempRowData.unit);
        formData.append(
          "disabledStoresIds",
          JSON.stringify(tempRowData.disabledStoresIds)
        );
        if (tempRowData.image) formData.append("image", tempRowData.image);

        const response = await apiService.products.updateProduct(
          tempRowData.id,
          formData as unknown as Product
        );
        if (response) {
          const updatedRows = [...rows];
          updatedRows[editingRow] = tempRowData;

          setRows(updatedRows);
          setEditingRow(null);
          setTempRowData(null);
          toast.success("מוצר עודכן בהצלחה");
        } else {
          toast.error("עדכון מוצר נכשל, אנא נסה נסית במועד מאוחר יותר");
        }
      }
    } catch (error) {
      toast.error("עדכון מוצר נכשל, אנא נסה נסית במועד מאוחר יותר");
      console.error("Error updating product:", error);
    }
  };
  const handleNewRowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked, files } = event.target;
    setNewRow({ ...newRow, [name]: type === "checkbox" ? checked : value });
  };

  const handleEditRowChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = event.target;
    if (tempRowData) {
      setTempRowData((prev: any) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  const handleRowClick = (index: number) => {
    setEditingRow(index);
    const rowData = rows[index];
    setTempRowData({ ...rowData });
  };
  const getDistributionPoints = async () => {
    const points = await apiService.stores.getStores();
    setDistributionPoints(points);
  };

  const getProduct = async () => {
    const products = await apiService.products.getProducts(accountUrl);
    console.log(products, "products");  
    
    setRows(products);
  };

  const isAllFieldsFulfilled = () => {
    return newRow.name !== "" && newRow.price !== 0;
  };

  const renderRowInEditMode = (index: number) => {
    return (
      <>
        <TableCell>
          <Checkbox
            checked={tempRowData.status}
            onChange={handleEditRowChange}
            name="status"
          />
        </TableCell>
        <TableCell>{renderDistributionPointSelect(true)}</TableCell>

        <TableCell>
          <TextField
            variant="outlined"
            name="name"
            value={tempRowData.name}
            onChange={handleEditRowChange}
            size="small"
          />
        </TableCell>
        <TableCell>
          {tempRowData.imagePreviewUrl || tempRowData.image ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              {tempRowData?.imagePreviewUrl || tempRowData?.image ? (
                <img
                  src={tempRowData.imagePreviewUrl || tempRowData.image}
                  alt="Preview"
                  width="50"
                />
              ) : (
                "not available"
              )}
              <IconButton onClick={() => handleRemoveImage(index)}>
                {"x"}
              </IconButton>
            </div>
          ) : (
            <Button component="label" variant="contained">
              Upload
              <input
                type="file"
                hidden
                onChange={(event) => handleImageChange(event, index)}
              />
            </Button>
          )}
        </TableCell>
        <TableCell>
          <TextField
            type="number"
            variant="outlined"
            name="price"
            value={tempRowData.price}
            onChange={handleEditRowChange}
            size="small"
            inputProps={{ min: 0 }}
          />
        </TableCell>
        <TableCell>
          <Select
            size="small"
            value={tempRowData.unit}
            name="unit"
            onChange={(event) =>
              setTempRowData({
                ...tempRowData,
                unit: event.target.value as Units,
              })
            }
          >
            {Object.values(Units).map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </Select>
        </TableCell>
        <TableCell>
          <Button variant="contained" onClick={handleSaveRow}>
            Save
          </Button>
        </TableCell>
      </>
    );
  };

  const renderNewRow = () => {
    return (
      <TableRow>
        <TableCell>
          <Checkbox
            checked={newRow.status}
            onChange={handleNewRowChange}
            name="status"
          />
        </TableCell>
        <TableCell>{renderDistributionPointSelect(false)}</TableCell>
        <TableCell>
          <TextField
            variant="outlined"
            name="name"
            value={newRow.name}
            onChange={handleNewRowChange}
            placeholder="Product Name"
            size="small"
          />
        </TableCell>
        <TableCell>
          {newRow.imagePreviewUrl ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <img src={newRow.imagePreviewUrl} alt="Preview" width="50" />
              <IconButton onClick={() => handleRemoveImage()}>{"x"}</IconButton>
            </div>
          ) : (
            <Button component="label" variant="contained">
              Upload
              <input
                type="file"
                hidden
                onChange={(event) => handleImageChange(event)}
              />
            </Button>
          )}
        </TableCell>
        <TableCell>
          <TextField
            type="number"
            variant="outlined"
            name="price"
            value={newRow.price}
            onChange={handleNewRowChange}
            size="small"
            placeholder="Price"
            inputProps={{ min: 0 }}
          />
        </TableCell>
        <TableCell>
          <Select
            size="small"
            value={newRow.unit}
            name="unit"
            onChange={(event) =>
              setNewRow({ ...newRow, unit: event.target.value as Units })
            }
          >
            {Object.values(Units).map((unit) => (
              <MenuItem key={unit} value={unit}>
                {unit}
              </MenuItem>
            ))}
          </Select>
        </TableCell>
        <TableCell>
          <Button
            onClick={handleAddRow}
            variant="contained"
            disabled={!isAllFieldsFulfilled()}
          >
            Add
          </Button>
        </TableCell>
      </TableRow>
    );
  };

  const handleDistributionPointChange = (event: any, isEditing = false) => {
    const selectedIds = event.target.value;
    if (isEditing) {
      if (tempRowData) {
        const updatedDisabledStores = [...selectedIds];
        setTempRowData({
          ...tempRowData,
          disabledStoresIds: updatedDisabledStores,
        });
      }
    } else {
      const updatedDisabledStores = [...selectedIds];
      setNewRow({ ...newRow, disabledStoresIds: updatedDisabledStores });
    }
  };

  const renderDistributionPointSelect = (isEditing = false) => {
    return (
      <FormControl fullWidth>
        <InputLabel>נקודות חלוקה</InputLabel>
        <Select
          multiple
          value={
            isEditing
              ? tempRowData?.disabledStoresIds || []
              : newRow.disabledStoresIds || []
          }
          onChange={(event) => handleDistributionPointChange(event, isEditing)}
          renderValue={(selected) => {
            const selectedNames = selected
              .map(
                (id: number) =>
                  distributionPoints.find((point) => point.id === id)?.name
              )
              .filter(Boolean); // Filter out any undefined names
            return selectedNames.join(", ");
          }}
        >
          {distributionPoints.map((point) => {
            return (
              <MenuItem key={point.id} value={point.id}>
                <Checkbox
                  checked={
                    isEditing
                      ? tempRowData?.disabledStoresIds?.includes(point.id) ||
                        false
                      : newRow.disabledStoresIds?.includes(point.id) || false
                  }
                />
                <ListItemText primary={point.name} />
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    );
  };

  return (
    <PageWrapper>
      <ToastContainer position="top-center" />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>סטטוס מוצר</TableCell>
              <TableCell>הסר מנקודות חלוקה</TableCell>
              <TableCell>שם</TableCell>
              <TableCell>תמונה</TableCell>
              <TableCell>מחיר</TableCell>
              <TableCell>יחידת מידה</TableCell>
              <TableCell>פעולה</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow
                key={index}
                onClick={() => handleRowClick(index)}
                hover
                selected={editingRow === index}
              >
                {editingRow === index && tempRowData ? (
                  renderRowInEditMode(index)
                ) : (
                  <>
                    <TableCell>{row.status ? "Active" : "Inactive"}</TableCell>
                    <TableCell>
                      {(
                        row.disabledStoresIds?.map(
                          (storeId) =>
                            distributionPoints.find(
                              (store) => store.id === storeId
                            )?.name
                        ) || []
                      ).join(", ")}
                    </TableCell>

                    <TableCell>{row.name}</TableCell>
                    <TableCell>
                      {row.image ? (
                        <img src={row.image} alt={row.name} width="50" />
                      ) : (
                        "not available"
                      )}
                    </TableCell>
                    <TableCell>{row.price}</TableCell>
                    <TableCell>{row.unit}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleRowClick(index)}
                        variant="contained"
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </>
                )}
              </TableRow>
            ))}
            {renderNewRow()}
          </TableBody>
        </Table>
      </TableContainer>
    </PageWrapper>
  );
};

const PageWrapper = styled(IPageWrapper)`
  padding: 2rem;
`;

export default ProductTable;
