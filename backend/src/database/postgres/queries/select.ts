import { QueryResult } from 'pg';
import { pool } from '../connection';

export async function findChatbotById(id: string): Promise<QueryResult> {
    try {
        const query = `
            SELECT
                id,
                store,
                name,
                to_char(created_at, 'YYYY-MM-DD') as created_at
            FROM
                chatbot
            WHERE id = $1;
        `
        const findByQuery = await pool.query(query, [id]);
        if (findByQuery.rows.length > 0) {
            return findByQuery;
        } else {
            throw new Error('No messages found');
        }
    } catch (error) {
        console.error('Error in findChatbotById:', error);
        throw error;
    }
}

export async function getAllMessages(chatbotId: string): Promise<{ stage: number; position: number; content: string }[]> {
    try {
        const query = `
            SELECT 
                stage,
                position,
                content
            FROM chatbot_message
            WHERE chatbot_id = $1
            ORDER BY stage, position;
        `;
        const querySet = await pool.query(query, [chatbotId]);
        if (querySet.rows.length > 0) {
            return querySet.rows;
        } else {
            throw new Error('No messages found');
        }
    } catch (error) {
        //console.error('Error in getAllMessages:', error);
        throw error;
    }
}

export async function getAllItems(chatbotId: string): Promise<{ id: string; name: string; description: string; price: number; }[]> {
    try {
        const query = `
            SELECT 
				id,
                name,
                description,
                price
            FROM item
            WHERE chatbot_id = $1
            ORDER BY price;
        `;
        const querySet = await pool.query(query, [chatbotId]);
        if (querySet.rows.length > 0) {
            return querySet.rows;
        } else {
            throw new Error('No messages found');
        }
    } catch (error) {
        //console.error('Error in getAllMessages:', error);
        throw error;
    }
}

export async function getIdChatbotToDevelopment(): Promise<{ id: string }> {
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
    } catch (error) {
        console.error('Error in getIdChatbotToDevelopment:', error);
        throw error;
    }
}



export async function existsByStore(store: string): Promise<{ count: number }> {
    try {
        const querySet = await pool.query(`SELECT COUNT(1) FROM chatbot WHERE "store" = $1`, [store])
        const [result] = querySet.rows;
        return result;
    } catch (error) {
        console.error('Error in existsByStore:', error);
        throw error;
    }
}
