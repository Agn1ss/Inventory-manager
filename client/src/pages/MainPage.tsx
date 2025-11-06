import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import Header from "../components/Header";
import InventorySection from "../components/InventorySection";
import TagSection from "../components/TagSection";
import useInventoryListStore from "../store/inventoryListStore";
import useSearchStore from "../store/searchStore";
import toast from "react-hot-toast";
import ApiErrorHandler from "../exeptions/apiErrorHandler";
import SearchResultSection from "../components/SearchResultSection";
import type InventorylistDataResponse from "../models/response/InventorylistDataResponse";
import InventoryTableBox from "../components/boxes/inventoryTable/InventoryTableBox";
import { COLUMNS } from "../utils/data/names";

interface InventoryListState {
  data: InventorylistDataResponse[];
  loading: boolean;
}

export default function MainPage() {
  const { t } = useTranslation();
  const { searchTerm } = useSearchStore();
  const [searchData, setSearchData] = useState<InventoryListState>({ data: [], loading: true });

  const {
    fetchSearchInventories,
    latestInventories,
    fetchLatestInventories,
    popularInventories,
    fetchPopularInventories,
    inventoriesByTag,
    selectedTagName,
  } = useInventoryListStore();

  useEffect(() => {
    if (selectedTagName) {
      setSearchData(inventoriesByTag);
    } else if (searchTerm.trim()) {
      setSearchData({ data: [], loading: true });
      fetchSearchInventories(searchTerm)
        .then(() => {
          const state = useInventoryListStore.getState();
          setSearchData(state.searchResults);
        })
        .catch(err => {
          const message = ApiErrorHandler.handle(err);
          toast.error(message);
        });
    } else {
      setSearchData({ data: [], loading: false });
    }
  }, [searchTerm, selectedTagName, inventoriesByTag]);

  return (
    <>
      <Header searchPlaceholder="search_inv" />

      <Container fluid className="m-0 w-80 mt-5">
        <Row>
          <Col md={6} className="d-flex flex-column gap-3">
            <InventorySection
              title={t("latest_inventories")}
              columns={COLUMNS}
              fetchData={fetchLatestInventories}
              loading={latestInventories.loading}
              >
              <InventoryTableBox inventoriesData={latestInventories.data} />
            </InventorySection>

            <InventorySection
              title={t("popular_inventories")}
              columns={COLUMNS}
              fetchData={fetchPopularInventories}
              loading={popularInventories.loading}
            >
              <InventoryTableBox inventoriesData={popularInventories.data} />
            </InventorySection>
          </Col>

          <Col md={6} className="d-flex flex-column gap-3">
            {searchTerm || selectedTagName ? (
              <SearchResultSection
                title={t("search_results")}
                columns={COLUMNS}
                data={searchData.data}
                loading={searchData.loading}
              />
            ) : (
              <h4 className="text-xl text-secondary font-semibold m-5 w-50 mx-auto text-center">
                {t("start_typing")}
              </h4>
            )}

            <div className="mt-auto " style={{ marginBottom: "30%" }}>
              <TagSection />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
