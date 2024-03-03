import { useEffect, useRef, useState } from "react";
import { InitiativeItem, InitiativeItemType } from "./InitiativeItem";
import { v4 as uuidv4 } from "uuid";
import { InitiativeListItem } from "./InitiativeListItem";
import { InitiativeHeader } from "./InitiativeHeader";
import { Tooltip } from "@mui/material";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Box from "@mui/material/Box";
import SkipNextRounded from "@mui/icons-material/SkipNextRounded";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import GroupsRoundedIcon from "@mui/icons-material/GroupsRounded";
import OBR from "@owlbear-rodeo/sdk";

export function InitiativeTracker() {
  const [initiativeItems, setInitiativeItems] = useState<InitiativeItem[]>([]);
  const [combatStarted, setCombatStarted] = useState(false);
  const [role, setRole] = useState<"GM" | "PLAYER">("PLAYER");
  const [currentTurn, setCurrentTurn] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    OBR.player.getRole().then(setRole);
  }, []);

  useEffect(() => {
    OBR.room.onMetadataChange((metadata) => {
      if (metadata.initiativeItems) {
        setInitiativeItems(metadata.initiativeItems as InitiativeItem[]);
      }
    });
  }, []);

  useEffect(() => {
    if (listRef.current && ResizeObserver) {
      const resizeObserver = new ResizeObserver((entries) => {
        if (entries.length > 0) {
          const entry = entries[0];
          // Get the height of the border box
          // In the future you can use `entry.borderBoxSize`
          // however as of this time the property isn't widely supported (iOS)
          const borderHeight = entry.contentRect.bottom + entry.contentRect.top;
          // Set a minimum height of 64px
          const listHeight = Math.max(borderHeight, 200);
          // Set the action height to the list height + the card header height + the divider
          OBR.action.setHeight(listHeight + 64 + 1);
          OBR.action.setWidth(600);
        }
      });
      resizeObserver.observe(listRef.current);
      return () => {
        resizeObserver.disconnect();
        // Reset height when unmounted
        OBR.action.setHeight(129);
      };
    }
  }, []);

  useEffect(() => {
    // Sync changes over the network
    const timeoutId = setTimeout(() => {
      OBR.room.setMetadata({
        initiativeItems: initiativeItems,
      });
    }, 500);

    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [initiativeItems]);

  function handleAddInitiativeItem() {
    setInitiativeItems([
      ...initiativeItems,
      {
        id: uuidv4(),
        count: `${initiativeItems.length}`,
        name: "Créature",
        active: false,
        visible: true,
        visibleRealName: true,
        type: InitiativeItemType.ENEMMY,
      },
    ]);
  }

  function handleNextClick() {
    // Get the next index to activate
    const sorted = initiativeItems.sort(
      (a, b) => parseFloat(b.count) - parseFloat(a.count)
    );
    const nextIndex =
      (sorted.findIndex((initiative) => initiative.active) + 1) % sorted.length;

    if (nextIndex === 0) {
      setCurrentTurn((prev) => prev + 1);
    }

    // Set local items immediately
    setInitiativeItems((prev) => {
      return prev.map((init, index) => ({
        ...init,
        active: index === nextIndex,
      }));
    });
  }

  function handleAddDefaultPlayerGroup() {
    setInitiativeItems((prev) => [
      ...prev,
      {
        id: uuidv4(),
        count: `${initiativeItems.length}`,
        name: "Alberich",
        active: false,
        visible: true,
        visibleRealName: true,
        type: InitiativeItemType.PC,
      },
      {
        id: uuidv4(),
        count: `${initiativeItems.length}`,
        name: "Yun",
        active: false,
        visible: true,
        visibleRealName: true,
        type: InitiativeItemType.PC,
      },
      {
        id: uuidv4(),
        count: `${initiativeItems.length}`,
        name: "Arther",
        active: false,
        visible: true,
        visibleRealName: true,
        type: InitiativeItemType.PC,
      },
      {
        id: uuidv4(),
        count: `${initiativeItems.length}`,
        name: "Aelar ",
        active: false,
        visible: true,
        visibleRealName: true,
        type: InitiativeItemType.PC,
      },
    ]);
  }

  function getStartButtonTooltip() {
    if (role === "PLAYER") {
      return "Seul le MJ peut démarrer le combat";
    } else if (initiativeItems.length === 0) {
      return "Ajouter des créatures pour commencer le combat";
    } else {
      return "Démarrer le combat";
    }
  }

  function handleInitiativeCountChange(id: string, newCount: string) {
    setInitiativeItems((prev) =>
      prev.map((initiative) => {
        if (initiative.id === id) {
          return {
            ...initiative,
            count: newCount,
          };
        } else {
          return initiative;
        }
      })
    );
  }

  const handleNameChange = (updatedItem: InitiativeItem) => {
    setInitiativeItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === updatedItem.id ? { ...item, name: updatedItem.name } : item
      );

      return updatedItems;
    });
  };

  const handleTypeChange = (updatedItem: InitiativeItem) => {
    setInitiativeItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === updatedItem.id ? { ...item, type: updatedItem.type } : item
      );

      return updatedItems;
    });
  };

  const handleNameVisibilityChange = (id: string) => {
    setInitiativeItems((prevItems) => {
      const updatedItems = prevItems.map((item) =>
        item.id === id
          ? { ...item, visibleRealName: !item.visibleRealName }
          : item
      );

      return updatedItems;
    });
  };

  const handleDelete = (updatedItem: InitiativeItem) => {
    setInitiativeItems((prevItems) => {
      const updatedItems = prevItems.filter(
        (item) => item.id !== updatedItem.id
      );
      return updatedItems;
    });
  };

  return (
    <Stack height="100vh">
      <InitiativeHeader
        subtitle={
          initiativeItems.length === 0
            ? "Insérer des créatures pour commencer le combat"
            : undefined
        }
        currentTurn={currentTurn}
        action={
          <>
            <Tooltip
              title={
                role === "PLAYER"
                  ? "Seul le MJ peut faire ça"
                  : "Ajouter le groupe d'aventurier"
              }
            >
              <span>
                <IconButton
                  aria-label="next"
                  onClick={handleAddDefaultPlayerGroup}
                  disabled={role === "PLAYER"}
                >
                  <GroupsRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip
              title={
                role === "PLAYER"
                  ? "Seul le MJ peut faire ça"
                  : "Ajouter une créature"
              }
            >
              <span>
                <IconButton
                  aria-label="next"
                  onClick={handleAddInitiativeItem}
                  disabled={role === "PLAYER"}
                >
                  <AddCircleOutlineRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>
            {combatStarted ? (
              <>
                <Tooltip
                  title={
                    role === "PLAYER"
                      ? "Seul le MJ peut faire ça"
                      : "Tour suivant"
                  }
                >
                  <span>
                    <IconButton
                      aria-label="next"
                      onClick={handleNextClick}
                      disabled={
                        initiativeItems.length === 0 || role === "PLAYER"
                      }
                    >
                      <SkipNextRounded />
                    </IconButton>
                  </span>
                </Tooltip>
              </>
            ) : (
              <Tooltip title={getStartButtonTooltip()}>
                <span>
                  <IconButton
                    aria-label="next"
                    onClick={() => setCombatStarted(true)}
                    disabled={initiativeItems.length === 0 || role === "PLAYER"}
                  >
                    <PlayCircleOutlineRoundedIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )}
          </>
        }
      />
      <Box sx={{ overflowY: "auto" }}>
        <List ref={listRef}>
          {initiativeItems
            .sort((a, b) => parseFloat(b.count) - parseFloat(a.count))
            .map((initiativeItem) => (
              <InitiativeListItem
                key={initiativeItem.id}
                initiativeItem={initiativeItem}
                onNameChange={handleNameChange}
                onCountChange={(newCount) => {
                  handleInitiativeCountChange(initiativeItem.id, newCount);
                }}
                onTypeChange={handleTypeChange}
                onNameVisibilityChange={handleNameVisibilityChange}
                onDelete={handleDelete}
                showHidden={role === "GM"}
              />
            ))}
        </List>
      </Box>
    </Stack>
  );
}
