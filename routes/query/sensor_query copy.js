const _query = {
    findByAll() {
        var query = 'SELECT * FROM sensor_view ORDER BY id ASC;';
        return query;
    },
    findBySiteIndex(data) {
        var _siteIndex = data;
        var query = `SELECT * FROM sensor_view WHERE site_index="${_siteIndex}" ORDER BY id ASC;`;
        return query;
    },
    insert(data) {
        let _data = data;
        let _createdDate = _data.createdDate ? `"${_data.createdDate}"` : null;
        let _deviceIndex = _data.device_index ? `"${_data.device_index}"` : null;
        let _sensorIndex = _data.sensor_index ? `"${_data.sensor_index}"` : null;
        let _name= _data.name ? `"${_data.name}"` : null;
        let _serverIndex = _data.server_index ? `"${_data.server_index}"` : null;
        let _siteIndex = _data.site_index ? `"${_data.site_index}"` : null;
        let _version = _data.version ? `${_data.version}` : 0;

        let _description = _data.description ? `"${_data.description}"` : null;


        let query = `INSERT INTO info_sensor 
                    (created_date, device_index, sensor_index, name, server_index, site_index, version, description)
                    VALUE (${_createdDate}, ${_deviceIndex},${_sensorIndex}, ${_name}, ${_serverIndex}, ${_siteIndex}, ${_version}, ${_description});`;
        return query;
    },
    update(data) {
        let _data = data;
        let _id = _data.id;
        let _modifiedDate = _data.modifiedDate ? `"${_data.modifiedDate}"` : null;
        let _deviceIndex = _data.device_index ? `"${_data.device_index}"` : null;
        let _sensorIndex = _data.sensor_index ? `"${_data.sensor_index}"` : null;
        let _name= _data.name ? `"${_data.name}"` : null;
        let _siteIndex = _data.site_index ? `"${_data.site_index}"` : null;
        let _version = _data.version ? `${_data.version}` : 0;
        let _description = _data.description ? `"${_data.description}"` : null;

        let query = `UPDATE info_sensor SET 
                     modified_date=${_modifiedDate},
                     device_index=${_deviceIndex}, 
                     sensor_index=${_sensorIndex}, 
                     name=${_name}, 
                     site_index=${_siteIndex}, 
                     version=${_version}, 
                     description=${_description}
                     WHERE id=${_id}`;

        return query;
    },
    delete(param) {
        let query = `DELETE FROM info_sensor WHERE sensor_index="${param}";`;
        return query;
    },
    checked: function(data) {
        var _sensorIndex = data.sensor_index;
        var query = `SELECT id, COUNT(*) AS count FROM info_sensor WHERE sensor_index = "${_sensorIndex}";`;
  
        return query;
     }
}

module.exports = _query;
