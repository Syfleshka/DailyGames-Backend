import { Request, Response } from 'express';
import pool from '../config/db';

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'SELECT nickname FROM users where id = $1',
            [id]
        );
        res.status(200).json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { nickname, email, password } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (nickname, email, password, role) VALUES ($1, $2, $3, 1) RETURNING *',
            [nickname, email, password]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
            [name, email, id]
        );
        res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
