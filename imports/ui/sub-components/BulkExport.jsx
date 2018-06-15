import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Dropzone from 'react-dropzone'

class BulkExport extends Component {

  handleValueChange(field, newValue){
    var info = Session.get(this.props.organ+'-bulkExportInfo');
    info[field] = newValue;
    Session.set(this.props.organ+'-bulkExportInfo', info);
    localStorage.setItem(this.props.organ+'-bulkExportInfo', JSON.stringify({'db': info['db'], 'key': info['key']}));
  }

  handleOnDrop(files){
    var fr = new FileReader();
    var filename = files[0].name;
    fr.readAsText(files[0]);

    fr.onload = (e) => {
      var list = fr.result.replace(/\r|\n|\r\n|\s/g, "").split(",");

      var info = Session.get(this.props.organ+'-bulkExportInfo');
      info['filename'] = filename;
      info['list'] = list;
      Session.set(this.props.organ+'-bulkExportInfo', info);
    }
  }

  render() {

    return (
      <div className="list-container">
        <div className="export-bulk-option col-sm-12 col-md-6 col-lg-6" key="bulk-db">
          <SelectField fullWidth={true} floatingLabelText="Database" id="bulk-db" value={this.props.db}
          onChange={(event, index, value) => this.handleValueChange("db", value)}>
            <MenuItem value="reports" key="bulk-db-reports" primaryText="Reports"/>
            <MenuItem value="episodes" key="bulk-db-episodes" primaryText="Episodes"/>
          </SelectField>
        </div>
        <div className="export-bulk-option col-sm-12 col-md-6 col-lg-6" key="bulk-key">
          <SelectField fullWidth={true} floatingLabelText="Export Key" id="bulk-key" value={this.props.reportKey}
          onChange={(event, index, value) => this.handleValueChange("key", value)}>
            <MenuItem value="EMPI" key="bulk-key-EMPI" primaryText="EMPI"/>
            <MenuItem value="ReportID" key="bulk-key-ReportID" primaryText="ReportID"/>
          </SelectField>
        </div>
        <Dropzone className="export-bulk" activeClassName="export-bulk-hover" rejectClassName="export-bulk-error"
        accept="text/*, application/vnd.ms-excel" onDrop={(files) => this.handleOnDrop(files)}/>
      </div>
    );
  }
}

export default withTracker((props) => {

  var info = Session.get(props.organ+'-bulkExportInfo');

  return({
    organ: props.organ,
    db: info['db'],
    reportKey: info['key'],
    filename: info['filename'],
    list: info['list'],
  })
})(BulkExport);
