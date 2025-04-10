import { pool } from '../connection.js';
export async function findById(id) {
    try {
        const query = `
    SELECT
        id,
        store,
        name,
        to_char(created_at, 'YYYY-MM-DD') as created_at,
        messages
    FROM
        chatbot
    WHERE "id" = $1;
    `;
        return pool.query(query, [id]);
    }
    catch (error) {
        console.error('Error in findById:', error);
        throw error;
    }
}
export async function getAllMessages(chatbotId) {
    try {
        const query = `
            SELECT 
                stage,
                message_number,
                content
            FROM chatbot_message
            WHERE chatbot_id = $1
            ORDER BY stage, message_number;
        `;
        const querySet = await pool.query(query, [chatbotId]);
        return querySet.rows;
    }
    catch (error) {
        console.error('Error in getAllMessages:', error);
        throw error;
    }
}
export async function getIdChatbotToDevelopment() {
    try {
        const query1 = `
            SELECT id FROM chatbot WHERE store = 'loja_exemplo';
        `;
        const querySet1 = await pool.query(query1);
        if (querySet1.rows.length > 0) {
            const [{ id }] = querySet1.rows;
            return { id };
        }
        const query2 = `
            INSERT INTO chatbot (store, name)
            VALUES ('loja_exemplo', 'nome_exemplo')
            ON CONFLICT (store) DO NOTHING
            RETURNING id;
        `;
        const querySet2 = await pool.query(query2);
        const [{ id }] = querySet2.rows;
        return { id };
    }
    catch (error) {
        console.error('Error in getIdChatbotToDevelopment:', error);
        throw error;
    }
}
export async function existsByStore(store) {
    try {
        const querySet = await pool.query(`SELECT COUNT(1) FROM chatbot WHERE "store" = $1`, [store]);
        const [result] = querySet.rows;
        return result;
    }
    catch (error) {
        console.error('Error in existsByStore:', error);
        throw error;
    }
}
