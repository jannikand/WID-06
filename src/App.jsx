/* eslint-disable no-unused-vars */
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";

function App() {
  const [Service, setService] = useState("");
  const [InputTitles, setInputTitles] = useState([]);
  const [Outputs, setOutputs] = useState([]);
  const [OutputShrink, setOutputShrink] = useState(false);
  const [Inputs, setInputs] = useState(["", ""]);
  const [firstclickcounter, setFirstclickcounter] = useState(0);
  const [ErrorMsg, setErrorMsg] = useState(null);

  const DropdownChange = (event) => {
    setFirstclickcounter(+1);
    setService(event.target.value);
    if (event.target.value === "lv95towgs84") {
      setInputTitles(["Ost", "Nord", "Länge", "Breite"]);
    } else if (event.target.value === "wgs84tolv95") {
      setInputTitles(["Länge", "Breite", "Ost", "Nord"]);
    } else if (event.target.value === "lv03towgs84") {
      setInputTitles(["Ost", "Nord", "Länge", "Breite"]);
    } else if (event.target.value === "wgs84tolv03") {
      setInputTitles(["Länge", "Breite", "Ost", "Nord"]);
    } else if (event.target.value === "lv95tolv03") {
      setInputTitles(["Ost", "Nord", "Ost", "Nord"]);
    } else if (event.target.value === "lv03tolv95") {
      setInputTitles(["Ost", "Nord", "Ost", "Nord"]);
    }
    if (firstclickcounter >= 1) {
      setInputs(["", ""]);
      setOutputs(["", ""]);
      setOutputShrink(false);
    }
  };

  async function TransformClick() {
    let URL = `https://geodesy.geo.admin.ch/reframe/${Service}?easting=${Inputs[0]}&northing=${Inputs[1]}&format=json`;
    try {
      const resp = await fetch(URL);
      if (resp.ok) {
        const data = await resp.json();
        setOutputShrink(true);
        setOutputs([data.easting, data.northing]);
      } else {
        throw new Error("Fehler beim Abrufen der Daten");
      }
    } catch (error) {
      setErrorMsg(error.message);
    }
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "500px" }}>
        <Stack spacing={2}>
          <Typography variant="h4" gutterBottom>
            Koordinatentransformation
          </Typography>
          {ErrorMsg && <Alert severity="error">{ErrorMsg}</Alert>}
          <Box sx={{ maxWidth: 240 }}>
            <FormControl fullWidth>
              <InputLabel>REFRAME Service</InputLabel>
              <Select
                value={Service}
                onChange={DropdownChange}
                label="REFRAME Service"
              >
                <MenuItem value="lv95towgs84">LV95 zu WGS84</MenuItem>
                <MenuItem value="wgs84tolv95">WGS84 zu LV95</MenuItem>
                <MenuItem value="lv03towgs84">LV03 zu WGS84</MenuItem>
                <MenuItem value="wgs84tolv03">WGS84 zu LV03</MenuItem>
                <MenuItem value="lv95tolv03">LV95 zu LV03</MenuItem>
                <MenuItem value="lv03tolv95">LV03 zu V95</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              id="outlined-basic"
              label={InputTitles[0]}
              variant="outlined"
              value={Inputs[0]}
              onChange={(e) => {
                const newInputs = [...Inputs];
                newInputs[0] = e.target.value;
                setInputs(newInputs);
              }}
            />
            <TextField
              fullWidth
              id="outlined-basic"
              label={InputTitles[1]}
              variant="outlined"
              value={Inputs[1]}
              onChange={(e) => {
                const newInputs = [...Inputs];
                newInputs[1] = e.target.value;
                setInputs(newInputs);
              }}
            />
          </Stack>
          <Button
            variant="contained"
            disabled={!(Inputs[0] !== "" && Inputs[1] !== "" && Service !== "")}
            onClick={TransformClick}
          >
            Transformieren
          </Button>
          <Stack direction="row" spacing={2}>
            <TextField
              fullWidth
              id="outlined-basic"
              label={InputTitles[2]}
              variant="outlined"
              value={Outputs[0]}
              slotProps={{
                input: {
                  readOnly: true,
                },
                inputLabel: {
                  shrink: OutputShrink,
                },
              }}
            />
            <TextField
              fullWidth
              id="outlined-basic"
              label={InputTitles[3]}
              variant="outlined"
              value={Outputs[1]}
              slotProps={{
                input: {
                  readOnly: true,
                },
                inputLabel: {
                  shrink: OutputShrink,
                },
              }}
            />
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}

export default App;
