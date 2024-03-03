import ListItem from "@mui/material/ListItem";
import Input from "@mui/material/Input";
import ListItemIcon from "@mui/material/ListItemIcon";

import VisibilityOffRounded from "@mui/icons-material/VisibilityOffRounded";
import VisibilityRounded from "@mui/icons-material/VisibilityRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import Person4RoundedIcon from "@mui/icons-material/Person4Rounded";
import CasinoRoundedIcon from "@mui/icons-material/CasinoRounded";

import OBR from "@owlbear-rodeo/sdk";

import { InitiativeItem, InitiativeItemType } from "./InitiativeItem";
import { useEffect, useState } from "react";
import {
  Popover,
  Typography,
  ButtonGroup,
  IconButton,
  Box,
  Grid,
  Tooltip,
} from "@mui/material";
import React from "react";

type InitiativeListItemProps = {
  initiativeItem: InitiativeItem;
  onCountChange: (count: string) => void;
  onNameChange: (updatedItem: InitiativeItem) => void;
  onTypeChange: (updatedItem: InitiativeItem) => void;
  onNameVisibilityChange: (id: string) => void;
  onDelete: any;
  showHidden: boolean;
};

export function InitiativeListItem({
  initiativeItem,
  onCountChange,
  onNameChange,
  onTypeChange,
  onNameVisibilityChange,
  onDelete,
  showHidden,
}: InitiativeListItemProps) {
  const [playerIsGM, setPlayerIsGM] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;
  const backgroundColorPerType: Record<InitiativeItemType, string> = {
    [InitiativeItemType.PC]: "rgba(154, 255, 153, 0.16)",
    [InitiativeItemType.FRIENDLY]: "rgba(153, 188, 255, 0.16)",
    [InitiativeItemType.ENEMMY]: "rgba(255, 153, 153, 0.16)",
    [InitiativeItemType.NEUTRAL]: "rgba(252, 255, 153, 0.16)",
  };

  if (!initiativeItem.visible && !showHidden) {
    return null;
  }

  useEffect(() => {
    async function checkPlayerRole() {
      const result = await OBR.player.getRole();
      setPlayerIsGM(result === "GM");
    }
    checkPlayerRole();
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <ListItem
        key={initiativeItem.id}
        sx={{
          pr: "64px",
          "&.Mui-selected": {
            backgroundColor: backgroundColorPerType[initiativeItem.type],
          },
        }}
        secondaryAction={
          <Input
            disableUnderline
            sx={{ width: 48 }}
            disabled={!playerIsGM}
            inputProps={{
              sx: {
                textAlign: "right",
              },
            }}
            value={initiativeItem.count}
            onChange={(e) => {
              const newCount = e.target.value;
              onCountChange(newCount);
            }}
            onDoubleClick={(e) => e.stopPropagation()}
          />
        }
        divider
        selected={initiativeItem.active}
      >
        {/* {!initiativeItem.visible && showHidden && (
          <ListItemIcon sx={{ minWidth: "30px", opacity: "0.5" }}>
            <VisibilityOffRounded fontSize="small" />
          </ListItemIcon>
        )} */}

        <ListItemIcon
          sx={{
            minWidth: "30px",
            opacity: "0.5",
            cursor: playerIsGM ? "pointer" : "default",
          }}
          onClick={(event: any) => {
            if (playerIsGM) {
              handleClick(event);
            }
          }}
        >
          <MoreVertRoundedIcon fontSize="small" />
        </ListItemIcon>

        <Input
          disableUnderline
          disabled={!playerIsGM}
          value={
            initiativeItem.visibleRealName
              ? initiativeItem.name
              : playerIsGM
              ? initiativeItem.name
              : "Nom caché"
          }
          onChange={(e) => {
            const newName = e.target.value;
            onNameChange({ ...initiativeItem, name: newName });
          }}
          onDoubleClick={(e) => e.stopPropagation()}
        />
      </ListItem>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Grid container spacing={2} alignItems={"center"} sx={{ pt: 2, px: 2 }}>
          <Grid item xs={3}>
            <Typography>Type</Typography>
          </Grid>
          <Grid item xs={9}>
            <ButtonGroup aria-label="Basic button group">
              <Tooltip title={"PC"}>
                <span>
                  <IconButton
                    sx={{
                      color: "green",
                    }}
                    aria-label="delete"
                    onClick={() =>
                      onTypeChange({
                        ...initiativeItem,
                        type: InitiativeItemType.PC,
                      })
                    }
                  >
                    <Person4RoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={"Allié"}>
                <span>
                  <IconButton
                    sx={{
                      color: "lightgreen",
                    }}
                    aria-label="delete"
                    onClick={() =>
                      onTypeChange({
                        ...initiativeItem,
                        type: InitiativeItemType.FRIENDLY,
                      })
                    }
                  >
                    <Person4RoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={"Ennemie"}>
                <span>
                  <IconButton
                    sx={{
                      color: "red",
                    }}
                    aria-label="delete"
                    onClick={() =>
                      onTypeChange({
                        ...initiativeItem,
                        type: InitiativeItemType.ENEMMY,
                      })
                    }
                  >
                    <Person4RoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title={"Neutre"}>
                <span>
                  <IconButton
                    sx={{
                      color: "yellow",
                    }}
                    aria-label="delete"
                    onClick={() =>
                      onTypeChange({
                        ...initiativeItem,
                        type: InitiativeItemType.NEUTRAL,
                      })
                    }
                  >
                    <Person4RoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </ButtonGroup>
          </Grid>
        </Grid>

        <Grid
          container
          spacing={2}
          sx={{ pb: 2, px: 2, pt: 1 }}
          alignItems={"center"}
        >
          <Grid item xs={3}>
            <Typography>Outils</Typography>
          </Grid>
          <Grid item xs={9}>
            <ButtonGroup aria-label="Basic button group">
              <Tooltip title={"Reroll initiative"}>
                <span>
                  <IconButton
                    color="secondary"
                    aria-label="delete"
                    onClick={(event) => {
                      event.stopPropagation();
                      onCountChange(Math.floor(Math.random() * 20).toString());
                    }}
                  >
                    <CasinoRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
              {initiativeItem.visibleRealName ? (
                <Tooltip title={"Cacher le nom"}>
                  <span>
                    <IconButton
                      color="secondary"
                      aria-label="hide"
                      onClick={(e) => {
                        onNameVisibilityChange(initiativeItem.id);
                      }}
                    >
                      <VisibilityOffRounded />
                    </IconButton>
                  </span>
                </Tooltip>
              ) : (
                <Tooltip title={"Afficher le nom"}>
                  <span>
                    <IconButton
                      color="secondary"
                      aria-label="show"
                      onClick={(e) => {
                        onNameVisibilityChange(initiativeItem.id);
                      }}
                    >
                      <VisibilityRounded />
                    </IconButton>
                  </span>
                </Tooltip>
              )}
              <Tooltip title={"Supprimer"}>
                <span>
                  <IconButton
                    color="error"
                    aria-label="delete"
                    onClick={() => onDelete(initiativeItem)}
                  >
                    <DeleteRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
            </ButtonGroup>
          </Grid>
        </Grid>
      </Popover>
    </>
  );
}
