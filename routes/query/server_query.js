const _query = {
    findByAll() {
        var query = 'SELECT * FROM info_server;';
        return query;
    },
    insert(data) {
        let _data = data;
        let _createdDate = _data.createdDate ? `"${_data.createdDate}"` : null;
        let _serverIndex = _data.server_index ? `"${_data.server_index}"` : null;
        let _address = _data.address ? `"${_data.address}"` : null;
        // let _version = _data.version ? `${_data.version}` : 0;
        let _description = _data.description ? `"${_data.description}"` : null;


        let query = `INSERT INTO info_server 
                    (created_date, server_index, address, number, description)
                    VALUE (${_createdDate}, ${_serverIndex}, ${_address}, 0,${_description});`;
        return query;
    },
    update(data) {
        let _data = data;
        let _id = _data.id;
        let _modifiedDate = _data.modifiedDate?  `"${_data.modifiedDate}"`: null;
        let _serverIndex = _data.server_index ? `"${_data.server_index}"` : null;
        let _address = _data.address ? `"${_data.address}"` : null;
        // let _version = _data.version ? `${_data.version}` : 0;
        let _description = _data.description ? `"${_data.description}"` : null;

        let query = `UPDATE info_server SET 
                     modified_date=${_modifiedDate}, 
                     server_index=${_serverIndex}, 
                     address=${_address}, 
                     description=${_description}
                     WHERE id=${_id}`;
        return query;
    },
    delete(id) {
        let query = `DELETE FROM info_server WHERE id=${id}`;
        return query;
    },
    checked(data) {
        var _serverIndex = data.server_index;
        var query = `SELECT id, COUNT(*) AS count FROM info_server WHERE server_index = "${_serverIndex}";`;
  
        return query;
     },
     plusNumber(index) {
         var _serverIndex = index;
        var query = `UPDATE info_server SET number = number+1 WHERE server_index="${_serverIndex}";`;

        return query;
     },
     minusNumber(index) {
        var _serverIndex = index;
        var query = `UPDATE info_server SET number = number-1 WHERE server_index="${_serverIndex}";`;
        return query;
    }

}

module.exports = _query;
