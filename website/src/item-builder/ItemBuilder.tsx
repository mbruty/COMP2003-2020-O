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
import { API_URL } from "../constants";

type checks = {
  IsVegetarian: boolean;
  IsVegan: boolean;
  IsHalal: boolean;
  IsKosher: boolean;
  HasLactose: boolean;
  HasNuts: boolean;
  HasGluten: boolean;
  HasEgg: boolean;
  HasSoy: boolean;
  none: boolean;
};

const allOffState = {
  IsVegetarian: false,
  IsVegan: false,
  IsHalal: false,
  IsKosher: false,
  HasLactose: false,
  HasNuts: false,
  HasGluten: false,
  HasEgg: false,
  HasSoy: false,
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
  const [checkBoxData, setCheckBoxData] = React.useState<checks>({
    ...allOffState,
  });
  const [imgError, setImgError] = React.useState<boolean>(false);

  useEffect(() => {
    if (props.match.params.id !== "create") {
      //ToDo fetch the food item data from api
      setTagId(parseInt(props.match.params.id));
    }
  }, [props.match.params.id]);

  useEffect(() => {
    (async () => {
      const raw = await fetch(
        API_URL + "/fooditem/verbose/" + props.match.params.id,
        {
          mode: "cors",
          credentials: "include",
        }
      );
      const data = await raw.json();
      setItemDetails({
        name: data.fooditem.FoodName,
        shortName: data.fooditem.FoodNameShort,
        description: data.fooditem.FoodDescription,
        price: data.fooditem.Price,
      });

      const checks: checks = data.checks as checks;
      setCheckBoxData(checks);

      setValue(data.tags as IFoodTag[])
      console.log(data);
    })();
  }, [props.match.params.id]);

  const [saveVisible, setSaveVisible] = React.useState<boolean>(false);

  const [search, setSearch] = React.useState<string>("");
  React.useEffect(() => {
    setLoading(true);
    (async () => setOptions(await getOptions(search)))();
    setLoading(false);
  }, [search]);

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
                  checked={checkBoxData.IsVegetarian}
                  onChange={() => {
                    if (checkBoxData.IsVegetarian) {
                      // Enforce that non-veggie food is also non-vegan
                      setCheckBoxData({
                        ...checkBoxData,
                        IsVegetarian: false,
                        IsVegan: false,
                        IsHalal: false,
                        IsKosher: false,
                        none: false,
                      });
                    } else {
                      setCheckBoxData({
                        ...checkBoxData,
                        IsVegetarian: true,
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
                  checked={checkBoxData.IsVegan}
                  onChange={() => {
                    if (checkBoxData.IsVegan) {
                      setCheckBoxData({
                        ...checkBoxData,
                        IsVegan: false,
                        none: false,
                      });
                    } else {
                      // Enforcing all vegan food is also veggie
                      // Enforcing all vegan food doesn't contain lactose
                      setCheckBoxData({
                        ...checkBoxData,
                        IsVegetarian: true,
                        IsVegan: true,
                        HasLactose: false,
                        HasEgg: false,
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
                  checked={checkBoxData.IsHalal}
                  onChange={() => {
                    if (checkBoxData.IsHalal) {
                      setCheckBoxData({
                        ...checkBoxData,
                        IsHalal: false,
                        none: false,
                      });
                      return;
                    }
                    if (checkBoxData.IsVegetarian) {
                      setCheckBoxData({
                        ...checkBoxData,
                        IsHalal: true,
                        none: false,
                      });
                      // If it's veggie, then it can be labelled as both halal and kosher
                      return;
                    }
                    // Enforcing the halal / kosher conflict
                    setCheckBoxData({
                      ...checkBoxData,
                      IsHalal: true,
                      IsKosher: false,
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
                  checked={checkBoxData.IsKosher}
                  onChange={() => {
                    if (checkBoxData.IsKosher) {
                      setCheckBoxData({
                        ...checkBoxData,
                        IsKosher: false,
                        none: false,
                      });
                      return;
                    }
                    if (checkBoxData.IsVegetarian) {
                      setCheckBoxData({
                        ...checkBoxData,
                        IsKosher: true,
                        none: false,
                      });
                      // If it's veggie, then it can be labelled as both halal and kosher
                      return;
                    }
                    // Enforcing the halal / kosher conflict
                    setCheckBoxData({
                      ...checkBoxData,
                      IsHalal: false,
                      IsKosher: true,
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
                  checked={checkBoxData.HasLactose}
                  onChange={() => {
                    if (checkBoxData.HasLactose) {
                      setCheckBoxData({
                        ...checkBoxData,
                        HasLactose: false,
                        none: false,
                      });
                    } else {
                      // Enforcing vegan food cannot contain lactose
                      setCheckBoxData({
                        ...checkBoxData,
                        IsVegan: false,
                        HasLactose: true,
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
                  checked={checkBoxData.HasNuts}
                  onChange={() =>
                    setCheckBoxData({
                      ...checkBoxData,
                      HasNuts: !checkBoxData.HasNuts,
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
                  checked={checkBoxData.HasGluten}
                  onChange={() =>
                    setCheckBoxData({
                      ...checkBoxData,
                      HasGluten: !checkBoxData.HasGluten,
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
                  checked={checkBoxData.HasEgg}
                  onChange={() => {
                    if (checkBoxData.HasEgg) {
                      setCheckBoxData({
                        ...checkBoxData,
                      HasEgg: false,
                        none: false,
                      });
                    } else {
                      // Enforcing vegan food cannot contain eggs
                      setCheckBoxData({
                        ...checkBoxData,
                        IsVegan: false,
                        HasEgg: true,
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
                  checked={checkBoxData.HasSoy}
                  onChange={() =>
                    setCheckBoxData({
                      ...checkBoxData,
                      HasSoy: !checkBoxData.HasSoy,
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
            getOptionLabel={(option) => option.Tag}
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
