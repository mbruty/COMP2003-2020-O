import React, { useEffect } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Button,
  Collapse,
  Divider,
  IconButton,
  Paper,
} from "@material-ui/core";
import { IFoodItem } from "../interfaces/IFoodItem";
import { MeiliSearch } from "meilisearch";
import IFoodTag from "../interfaces/IFoodTag";
import DragNDrop from "../file-upload/DragNDrop";
import { Close, Edit, Save } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import { RouteComponentProps } from "react-router";

const allOffState = {
  isVegetarian: false,
  isVegan: false,
  isHalal: false,
  isKosher: false,
  hasLactose: false,
  hasNuts: false,
  hasGluten: false,
  hasEggs: false,
  hasSoy: false,
  none: false,
};

const index = new MeiliSearch({ host: "http://46.101.48.57" }).index(
  "foodtags"
);

const getOptions = async (searchText: string) => {
  if (searchText === "") return [];
  const data = await index.search(searchText);
  console.log(data);
  return data.hits as IFoodTag[];
};

const ItemBuilder: React.FC<RouteComponentProps<{ id: string }>> = (props) => {
  const [tagId, setTagId] = React.useState<number>(0);
  const [value, setValue] = React.useState<IFoodTag[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [options, setOptions] = React.useState<IFoodTag[]>([]);
  const [itemDetails, setItemDetails] = React.useState<IFoodItem>({
    name: "",
    shortName: "",
    description: "",
    price: "",
  });
  const [editImg, setEditImg] = React.useState<boolean>(false);
  const [imgError, setImgError] = React.useState<boolean>(false);

  useEffect(() => {
    if (props.match.params.id !== "create") {
      //ToDo fetch the food item data from api
      setTagId(parseInt(props.match.params.id));
    }
  }, [props.match.params.id]);

  const [saveVisible, setSaveVisible] = React.useState<boolean>(false);

  const [search, setSearch] = React.useState<string>("");
  React.useEffect(() => {
    setLoading(true);
    (async () => setOptions(await getOptions(search)))();
    setLoading(false);
  }, [search]);

  const [checkBoxData, setCheckBoxData] = React.useState({
    ...allOffState,
  });

  const showUpload = tagId > 0 && (imgError || editImg);

  return (
    <div className="content">
      <Collapse in={saveVisible}>
        <Alert
          variant="filled"
          severity="success"
          className={`save-toast${saveVisible ? " visible" : ""}`}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setSaveVisible(false);
              }}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          Changes Saved!
        </Alert>
      </Collapse>
      <Paper style={{ padding: "3em", marginBottom: "3em", maxWidth: "800px" }}>
        <h1>Item Builder</h1>
        <h2>Step 1: Item Details</h2>
        <h3>Tell us about your new item</h3>
        <FormGroup style={{ display: "grid", gap: "1em" }}>
          <TextField
            variant="outlined"
            id="itemName"
            label="Item Name"
            value={itemDetails.name}
          />
          <TextField
            variant="outlined"
            id="itemShortName"
            label="Short Name"
            value={itemDetails.shortName}
          />
          <TextField
            variant="outlined"
            id="itemDescription"
            label="Description"
            value={itemDetails.description}
          />
          <TextField
            variant="outlined"
            id="itemPrice"
            label="Price"
            value={itemDetails.price}
            onChange={(e: any) => {
              console.log(isNaN(e.target.value));
              if (!isNaN(e.target.value)) {
                setItemDetails({ ...itemDetails, price: e.target.value });
              }
            }}
          />
        </FormGroup>
        <Divider style={{ marginTop: "1em" }} />

        <div style={{ userSelect: "none" }}>
          <h2>Step 2: Food Checks</h2>
          <h3>Tell us if your new item fits into our allergin categories</h3>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  name="checkedVegetarian"
                  checked={checkBoxData.isVegetarian}
                  onChange={() => {
                    if (checkBoxData.isVegetarian) {
                      // Enforce that non-veggie food is also non-vegan
                      setCheckBoxData({
                        ...checkBoxData,
                        isVegetarian: false,
                        isVegan: false,
                        isHalal: false,
                        isKosher: false,
                        none: false,
                      });
                    } else {
                      setCheckBoxData({
                        ...checkBoxData,
                        isVegetarian: true,
                        none: false,
                      });
                    }
                  }}
                />
              }
              label="Vegetarian"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="checkedVegan"
                  checked={checkBoxData.isVegan}
                  onChange={() => {
                    if (checkBoxData.isVegan) {
                      setCheckBoxData({
                        ...checkBoxData,
                        isVegan: false,
                        none: false,
                      });
                    } else {
                      // Enforcing all vegan food is also veggie
                      // Enforcing all vegan food doesn't contain lactose
                      setCheckBoxData({
                        ...checkBoxData,
                        isVegetarian: true,
                        isVegan: true,
                        hasLactose: false,
                        hasEggs: false,
                        none: false,
                      });
                    }
                  }}
                />
              }
              label="Vegan"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="checkedHalal"
                  checked={checkBoxData.isHalal}
                  onChange={() => {
                    if (checkBoxData.isHalal) {
                      setCheckBoxData({
                        ...checkBoxData,
                        isHalal: false,
                        none: false,
                      });
                      return;
                    }
                    if (checkBoxData.isVegetarian) {
                      setCheckBoxData({
                        ...checkBoxData,
                        isHalal: true,
                        none: false,
                      });
                      // If it's veggie, then it can be labelled as both halal and kosher
                      return;
                    }
                    // Enforcing the halal / kosher conflict
                    setCheckBoxData({
                      ...checkBoxData,
                      isHalal: true,
                      isKosher: false,
                      none: false,
                    });
                  }}
                />
              }
              label="Halal"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="checkedKosher"
                  checked={checkBoxData.isKosher}
                  onChange={() => {
                    if (checkBoxData.isKosher) {
                      setCheckBoxData({
                        ...checkBoxData,
                        isKosher: false,
                        none: false,
                      });
                      return;
                    }
                    if (checkBoxData.isVegetarian) {
                      setCheckBoxData({
                        ...checkBoxData,
                        isKosher: true,
                        none: false,
                      });
                      // If it's veggie, then it can be labelled as both halal and kosher
                      return;
                    }
                    // Enforcing the halal / kosher conflict
                    setCheckBoxData({
                      ...checkBoxData,
                      isHalal: false,
                      isKosher: true,
                      none: false,
                    });
                  }}
                />
              }
              label="Kosher"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="checkedLactose"
                  checked={checkBoxData.hasLactose}
                  onChange={() => {
                    if (checkBoxData.hasLactose) {
                      setCheckBoxData({
                        ...checkBoxData,
                        hasLactose: false,
                        none: false,
                      });
                    } else {
                      // Enforcing vegan food cannot contain lactose
                      setCheckBoxData({
                        ...checkBoxData,
                        isVegan: false,
                        hasLactose: true,
                        none: false,
                      });
                    }
                  }}
                />
              }
              label="Contains Lactose"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="checkedNuts"
                  checked={checkBoxData.hasNuts}
                  onChange={() =>
                    setCheckBoxData({
                      ...checkBoxData,
                      hasNuts: !checkBoxData.hasNuts,
                      none: false,
                    })
                  }
                />
              }
              label="Contains Nuts"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="checkedGluten"
                  checked={checkBoxData.hasGluten}
                  onChange={() =>
                    setCheckBoxData({
                      ...checkBoxData,
                      hasGluten: !checkBoxData.hasGluten,
                      none: false,
                    })
                  }
                />
              }
              label="Contains Gluten"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="checkedEggs"
                  checked={checkBoxData.hasEggs}
                  onChange={() => {
                    if (checkBoxData.hasEggs) {
                      setCheckBoxData({
                        ...checkBoxData,
                        hasEggs: false,
                        none: false,
                      });
                    } else {
                      // Enforcing vegan food cannot contain eggs
                      setCheckBoxData({
                        ...checkBoxData,
                        isVegan: false,
                        hasEggs: true,
                        none: false,
                      });
                    }
                  }}
                />
              }
              label="Contains Eggs"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="checkedSoy"
                  checked={checkBoxData.hasSoy}
                  onChange={() =>
                    setCheckBoxData({
                      ...checkBoxData,
                      hasSoy: !checkBoxData.hasSoy,
                      none: false,
                    })
                  }
                />
              }
              label="Contains Soy"
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="checkedNone"
                  checked={checkBoxData.none}
                  onChange={() => {
                    if (checkBoxData.none) {
                      setCheckBoxData({ ...checkBoxData, none: false });
                    } else {
                      setCheckBoxData({ ...allOffState, none: true });
                    }
                  }}
                />
              }
              label="None"
            />
          </FormGroup>
        </div>
        <Divider style={{ marginTop: "1em" }} />

        <div>
          <h2>Step 3: Assign Food Tags</h2>
          <h3>
            Make your new item easier to find by giving it tags that help us
            describe it
          </h3>
          <Autocomplete
            multiple
            id="auto-complete"
            loading={loading}
            value={value}
            onInputChange={(e, value) => setSearch(value)}
            options={options}
            onChange={(e, value) => setValue(value)}
            getOptionLabel={(option) => option.tag}
            style={{ width: "100%", margin: "auto" }}
            renderInput={(params) => (
              <TextField {...params} label="Food Tag" variant="outlined" />
            )}
          />
        </div>

        <Divider style={{ marginTop: "1em" }} />

        {!tagId && (
          <h3 style={{ color: "#aaa" }}>
            You must create your item before uploading the image
          </h3>
        )}
        {!showUpload && (
          <div
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
          >
            <h2>Step 4: Image</h2>
            <img
              src={`https://storage.googleapis.com/tat-img/${tagId}.png`}
              alt="current-food"
              style={{
                marginTop: "10px",
                pointerEvents: "none",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              width="240px"
              onError={() => setImgError(true)}
            />
            <Button onClick={() => setEditImg(true)} style={{ marginTop: 10 }}>
              <Edit /> Edit Image
            </Button>
          </div>
        )}
        {showUpload && (
          <div>
            <h2>Step 4: Upload an Image</h2>
            <DragNDrop foodID={tagId} />
          </div>
        )}
        <div style={{ width: "100%", display: "flex" }}>
          {editImg && (
            <Button onClick={() => setEditImg(false)} style={{ marginTop: 10 }}>
              <Close /> Cancel editing
            </Button>
          )}
          <Button
            color="secondary"
            style={{ margin: "auto 0px auto auto" }}
            onClick={() => {
              // Do save here
              setSaveVisible(true);
              setTimeout(() => setSaveVisible(false), 5000);
            }}
          >
            <Save style={{ marginRight: "5px" }} />
            Save Changes
          </Button>
        </div>
      </Paper>
    </div>
  );
};

export default ItemBuilder;
