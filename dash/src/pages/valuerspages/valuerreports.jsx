import React from "react";
import Content from "../../layout/content/Content";
import Head from "../../layout/head/Head"
import {
  Block,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  BackTo,
  PreviewCard,
  ReactDataTable,
} from "../../components/Component";
import { DataTableData, dataTableColumns, dataTableColumns2, userData } from "./TableData";

const ValuerReports = () => {
  return (
    <>
      <Head title="Basic Tables" />
      <Content page="component">
        <BlockHead size="lg" wide="sm">
          <BlockHeadContent>

          </BlockHeadContent>
        </BlockHead>

        <Block size="lg">
          <BlockHead>
            <BlockHeadContent>
              <BlockTitle tag="h4">DataTable Default</BlockTitle>
              <p>
                Just import <code>ReactDataTable</code> from <code>components</code>, it is built in for react dashlite.
              </p>
            </BlockHeadContent>
          </BlockHead>

          {/* <PreviewCard> */}
            <ReactDataTable data={DataTableData} columns={dataTableColumns} expandableRows pagination />
          {/* </PreviewCard> */}
        </Block>


      </Content>
    </>
  );
};
export default ValuerReports;
