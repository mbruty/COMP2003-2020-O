import React from "react";
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

interface Props {}



const ItemBuilder: React.FC<Props> = () => {
  return (


    <div className="content">
      <h1>Welcome to the Track and Taste Item Builder</h1>
      <h3>Let's create a new item for your menu</h3>
      <span><hr/></span>

      <div>
        <h2>Step 1: Item Details</h2>
        <h3>Tell us about your new item</h3>
        <fieldset>
          <label>
            Item Name:
            <input type="text" name="itemName" /><br/><br/>
          </label>
          <label>
            Item Short Name:
            <input type="text" name="itemShortName" /><br/><br/>
          </label>
          <label>
            Description:
            <input type="text" name="itemDescription" /><br/><br/>
          </label>
          <label>
            Price:
            <input type="text" name="itemPrice" />
          </label>
        </fieldset>
      </div>

      <span><hr/></span>

      <div>
        <h2>Step 2: Food Checks</h2>
        <h3>Tell us if your new item fits into our allergin categories</h3>
        <fieldset>
          <FormGroup>
            <FormControlLabel
                control={<Checkbox name="checkedVegetarian" />}
                label="Vegetarian"
            />
            <FormControlLabel
                control={<Checkbox name="checkedVegan" />}
                label="Vegan"
                />
            <FormControlLabel
                control={<Checkbox name="checkedHalal" />}
                label="Halal"
            />
            <FormControlLabel
                control={<Checkbox name="checkedKosher" />}
                label="Kosher"
            />
            <FormControlLabel
                control={<Checkbox name="checkedLactose" />}
                label="Contains Lactose"
            />
            <FormControlLabel
                control={<Checkbox name="checkedNuts" />}
                label="Contains Nuts"
            />
            <FormControlLabel
                control={<Checkbox name="checkedGluten" />}
                label="Contains Gluten"
            />
            <FormControlLabel
                control={<Checkbox name="checkedEggs" />}
                label="Contains Eggs"
            />
            <FormControlLabel
                control={<Checkbox name="checkedSoy" />}
                label="Contains Soy"
            />
            <FormControlLabel
                control={<Checkbox name="checkedNone" />}
                label="None"
            />
          </FormGroup>
        </fieldset>
      </div>

      <span><hr/></span>

      <div>
        <h2>Step 3: Assign Food Tags</h2>
        <h3>Make your new item easier to find by giving it tags that help us describe it</h3>
        <fieldset>
          <Autocomplete
              id="combo-box-demo"
              options={autoCompleteOptions}
              getOptionLabel={(option) => option}
              style={{ width: 300 }}
              renderInput={(params) => <TextField {...params} label="Food Tag" variant="outlined" />}
          />
          <input type="button" value="Add Food Tag"/>
        </fieldset>
      </div>
      <span><hr/></span>

      <div>
        <h2>Step 4: Upload an Image</h2>
        <h3>Make your new item more appealing to customers by adding an image</h3>
        <fieldset>
          <h4>The Image Selector Goes Here</h4>
        </fieldset>

      </div>
      <span><hr/></span>
      <div>
        <h2>Step 5: Create Your Item</h2>
        <h3>When you're happy with your item click the button below to save it</h3>
          <input type="button" value="Create Item"/>
      </div>
    </div>
  );
};

const autoCompleteOptions =[
    "Pizza",
    "Pasta",
    "Bread",
    "Wine",
    "Cheese"
]

export default ItemBuilder;
