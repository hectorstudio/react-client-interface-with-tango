import React, { Component } from "react";
import Inspector from "./Inspector/Inspector";
import { Widget } from "../types";
import { Collapse, CardBody, Card, CardHeader } from "reactstrap";
import WidgetLibrary from "./Library/WIdgetLibrary";
import DashboardLibrary from "./Library/DashboardLibrary";
import "./NewSideBar.css";
import DashboardLayers from "./DashboardLayers";

interface Props {
  mode: "run" | "edit";
  tangoDB: string;
  selectedWidgets: Widget[];
  selectedMenu: string;
}
interface State {
  selectedMenus: { [menu: string]: boolean };
}

export default class NewSideBar extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const state = {
      selectedMenus: {
        DASHBOARD_LIBRARY: false,
        WIDGET_LIBRARY: false,
        SELECTED_WIDGET: false,
        SELECTED_DASHBOARD: false
      }
    };
    if (props.selectedMenu) {
      state.selectedMenus[props.selectedMenu] = true;
    }
    this.state = state;
  }

  toggleMenu = (menu: string) => {
    this.setState({
      selectedMenus: {
        ...this.state.selectedMenus,
        [menu]: !this.state.selectedMenus[menu]
      }
    });
  };

  static getDerivedStateFromProps(props, state) {
    return {
      selectedMenus: {
        ...state.selectedMenus,
        SELECTED_WIDGET:
          props.selectedWidgets && props.selectedWidgets.length > 0
      }
    };
  }
  public render() {
    const { mode, selectedWidgets, tangoDB } = this.props;
    const { selectedMenus } = this.state;
    const selectedWidgetCssClass =
      selectedWidgets.length > 0 ? "" : "card-header-empty";
    if (mode === "run") {
      return null;
    }
    return (
      <div className="Sidebar">
        <Card>
          <CardHeader onClick={() => this.toggleMenu("DASHBOARD_LIBRARY")}>
            Dashboard Library
          </CardHeader>
          <Collapse isOpen={selectedMenus["DASHBOARD_LIBRARY"]}>
            <CardBody>
              <DashboardLibrary render={selectedMenus["DASHBOARD_LIBRARY"]} />
            </CardBody>
          </Collapse>
        </Card>

        <Card>
          <CardHeader onClick={() => this.toggleMenu("WIDGET_LIBRARY")}>
            Widget Library
          </CardHeader>
          <Collapse isOpen={selectedMenus["WIDGET_LIBRARY"]}>
            <CardBody>
              <WidgetLibrary render={selectedMenus["WIDGET_LIBRARY"]} />
            </CardBody>
          </Collapse>
        </Card>
        <Card>
          <CardHeader onClick={() => this.toggleMenu("SELECTED_DASHBOARD")}>
            Selected dashboard
          </CardHeader>
          <Collapse isOpen={selectedMenus["SELECTED_DASHBOARD"]}>
            <CardBody style={{background: "#f0f0f0"}}>
              <DashboardLayers />
            </CardBody>
          </Collapse>
        </Card>
        <Card>
          <CardHeader className={selectedWidgetCssClass}>
            Selected Widget
          </CardHeader>
          <Collapse isOpen={selectedMenus["SELECTED_WIDGET"]}>
            <CardBody>
              <Inspector
                nbrSelectedWidgets={selectedWidgets.length}
                widgets={selectedWidgets}
                isRootCanvas={true}
                tangoDB={tangoDB}
                render={selectedMenus["SELECTED_WIDGET"]}
              />
            </CardBody>
          </Collapse>
        </Card>
      </div>
    );
  }
}
