const _query = {
    findByAll() {
        var query = 'SELECT * FROM info_site;';
        return query;
    },
    insert(data) {
        let _data = data;
        let _createdDate = _data.createdDate ? `"${_data.createdDate}"` : null;
        let _siteIndex = _data.site_index ? `"${_data.site_index}"` : null;
        let _name = _data.name ? `"${_data.name}"` : null;
        let _serverIndex = _data.server_index ? `"${_data.server_index}"` : null;

        let query = `INSERT INTO info_site 
                    (created_date, site_index, name, server_index)
                    VALUE (${_createdDate}, ${_siteIndex}, ${_name}, ${_serverIndex});`;
        return query;
    },
    update(data) {
        let _data = data;
        let _id = _data.id;
        let _modifiedDate = _data.modifiedDate?  `"${_data.modifiedDate}"`: null;
        let _siteIndex = _data.site_index ? `"${_data.site_index}"` : null;
        let _name = _data.name ? `"${_data.name}"` : null;
        let _serverIndex = _data.server_index ? `"${_data.server_index}"` : null;

        let query = `UPDATE info_site SET 
                     modified_date=${_modifiedDate}, 
                     site_index=${_siteIndex}, 
                     name=${_name}, 
                     server_index=${_serverIndex}
                     WHERE id=${_id}`;
        return query;
    },
    delete(id) {
        let query = `DELETE FROM info_site WHERE id=${id}`;
        return query;
    },
    checked: function(data) {
        var _siteIndex = data.name;
        var query = `SELECT id, COUNT(*) AS count FROM info_site WHERE name = "${_siteIndex}";`;
  
        return query;
     }

}

module.exports = _query;
