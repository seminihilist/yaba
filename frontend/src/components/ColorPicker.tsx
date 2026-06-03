import {textColor, bgColor, COLORS} from "@/lib/color_utils";
import {Check} from "@mui/icons-material";
import {Grid, Radio, RadioGroup} from "@mui/material";
import {useEffect, useState} from "react";

export default function ColorPicker({defaultColor}: Readonly<{ defaultColor: string }>) {
    const [selectedColor, setSelectedColor] = useState(defaultColor);

    return (
        <RadioGroup
            defaultValue={defaultColor}
            className="columns-6 gap-1"
            row
            name="newColor"
            value={selectedColor}
            onChange={(e) => {
                setSelectedColor((e.target as HTMLInputElement).value)
            }}
        >
            <Grid container spacing={1.5} columns={8}>
                {
                    COLORS.map((color, index) => (
                        <Grid size={1} key={color}>
                            <Radio
                                checkedIcon={<Check htmlColor="#222"/>}
                                icon={<Check className={`${textColor(color, 500)}`}/>}
                                className={`rounded-sm ${bgColor(color, 500)} aspect-square w-6 h-6 sm:w-8 sm:h-8`}
                                value={color}
                                title={color}
                            />
                        </Grid>
                    ))
                }
            </Grid>
        </RadioGroup>
    )
}