import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import Stripe from "stripe";
import { z } from "zod";
import { insertTournamentSchema, insertMatchSchema, insertProductSchema } from "@shared/schema";

// Only initialize Stripe if we have the secret key
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // WebSocket handling
  wss.on('connection', (ws) => {
    console.log('New WebSocket connection established');

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());

        if (message.type === 'UPDATE_SCORE') {
          const match = await storage.updateMatch(message.matchId, {
            score1: message.score1,
            score2: message.score2
          });

          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(JSON.stringify({
                type: 'SCORE_UPDATED',
                match
              }));
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Tournament routes
  app.post('/api/tournaments', async (req, res) => {
    const tournament = await storage.createTournament(req.body);
    res.json(tournament);
  });

  app.get('/api/tournaments', async (req, res) => {
    const tournaments = await storage.listTournaments();
    res.json(tournaments);
  });

  app.get('/api/tournaments/:id', async (req, res) => {
    const tournament = await storage.getTournament(parseInt(req.params.id));
    if (!tournament) return res.status(404).send('Tournament not found');
    res.json(tournament);
  });

  // Match routes
  app.post('/api/matches', async (req, res) => {
    const match = await storage.createMatch(req.body);
    res.json(match);
  });

  app.patch('/api/matches/:id', async (req, res) => {
    const match = await storage.updateMatch(parseInt(req.params.id), req.body);
    res.json(match);
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    const products = await storage.listProducts();
    res.json(products);
  });

  // User routes
  app.get('/api/users', async (req, res) => {
    const users = await storage.listUsers();
    // Remove sensitive information before sending
    const sanitizedUsers = users.map(({ password, ...user }) => user);
    res.json(sanitizedUsers);
  });

  // Stripe payment route
  app.post('/api/create-payment-intent', async (req, res) => {
    if (!stripe) {
      return res.status(503).json({ message: 'Payment service not available' });
    }

    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      res.status(500).json({ message: 'Payment processing failed' });
    }
  });

  return httpServer;
}