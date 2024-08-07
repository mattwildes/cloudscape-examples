import { useEffect, useState } from "react";
import {
  Box,
  SpaceBetween,
  TableProps,
  Header,
  Table,
  StatusIndicator,
} from "@cloudscape-design/components";
import RouterButton from "../../components/wrappers/router-button";
import RouterLink from "../../components/wrappers/router-link";
import { TextHelper } from "../../common/helpers/text-helper";
import { Item } from "../../common/types";
import { ApiClient } from "../../common/api-client/api-client";

const ItemsColumnDefinitions: TableProps.ColumnDefinition<Item>[] = [
  {
    id: "name",
    header: "Name",
    sortingField: "name",
    cell: (item) => (
      <RouterLink href={`/emx/items/${item.itemId}`}>
        {item.Name}
      </RouterLink>
    ),
    isRowHeader: true,
  },
  // {
  //   id: "type",
  //   header: "Type",
  //   sortingField: "type",
  //   cell: (item) => item.type,
  // },
  {
    id: "starus",
    header: "Status",
    sortingField: "status",
    cell: (item) => (
      <StatusIndicator type={item.Status}>{item.Status}</StatusIndicator>
    ),
    minWidth: 120,
  },
  {
    id: "description",
    header: "Description",
    sortingField: "description",
    cell: (item) => item.Description,
  },
  {
    id: "availabilityzone",
    header: "Availability Zone",
    sortingField: "availabilityzone",
    cell: (item) => item.AvailabilityZone,
  },
];

export default function ItemsTable() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);

  useEffect(() => {
    (async () => {
      const apiClient = new ApiClient();
      // const items = await apiClient.items.getItems();
      const items = await apiClient.flows.getFlows();
      console.log(items);
      setItems(items);
      setLoading(false);
    })();
  }, []);

  return (
    <Table
      loading={loading}
      loadingText="Loading Items"
      selectionType="single"
      empty={
        <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
          <SpaceBetween size="xxs">
            <div>
              <b>No Items</b>
              <Box variant="p" color="inherit">
                Item is a thing that is used to do something.
              </Box>
            </div>
            <RouterButton href="/emx/add">Add Item</RouterButton>
          </SpaceBetween>
        </Box>
      }
      columnDefinitions={ItemsColumnDefinitions}
      items={items.slice(0, 5)}
      selectedItems={selectedItems}
      onSelectionChange={(event: {
        detail: TableProps.SelectionChangeDetail<Item>;
      }) => setSelectedItems(event.detail.selectedItems)}
      header={
        <Header
          counter={
            !loading
              ? TextHelper.getHeaderCounterText(items, selectedItems)
              : undefined
          }
          actions={
            <SpaceBetween direction="horizontal" size="xs">
              <RouterButton
                disabled={selectedItems.length !== 1}
                href={`/emx/items/${
                  selectedItems.length > 0 ? selectedItems[0].itemId : ""
                }`}
              >
                View
              </RouterButton>
              <RouterButton href="/emx/add">Add Output</RouterButton>
            </SpaceBetween>
          }
        >
          Items
        </Header>
      }
      footer={
        <Box textAlign="center">
          <RouterLink href="/emx">View all Items</RouterLink>
        </Box>
      }
    />
  );
}
