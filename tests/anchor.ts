import assert from "assert";
import * as web3 from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import type { VoteProgram } from "../target/types/vote_program";
describe("vote_program", () => {  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.VoteProgram as anchor.Program<VoteProgram>;
  

  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.VoteProgram;

  it("Can add a candidate!", async () => {
    // Generate a new Keypair for the candidate account
    const candidateAccount = anchor.web3.Keypair.generate();

    // Add a candidate
    await program.methods
      .addCandidate("Alice")
      .accounts({
        candidate: candidateAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([candidateAccount])
      .rpc();

    // Fetch the candidate account and check its properties
    const candidate = await program.account.candidate.fetch(
      candidateAccount.publicKey
    );
    assert.equal(candidate.nickname, "Alice");
    assert.equal(candidate.voteCount.toNumber(), 0);
  });

  it('Can vote for a candidate!', async () => {
    // Generate a new Keypair for the candidate account
    const candidateAccount = anchor.web3.Keypair.generate();

    // Add a candidate
    await program.methods
      .addCandidate("Bob")
      .accounts({
        candidate: candidateAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([candidateAccount])
      .rpc();

    // Vote for the candidate
    await program.methods
      .voteForCandidate()
      .accounts({
        candidate: candidateAccount.publicKey,
      })
      .rpc();

    // Fetch the candidate account and check its vote count
    const candidate = await program.account.candidate.fetch(candidateAccount.publicKey);
    assert.equal(candidate.voteCount.toNumber(), 1);
  });

  it("Can get vote count for a candidate!", async () => {
    // Generate a new Keypair for the candidate account
    const candidateAccount = anchor.web3.Keypair.generate();

    // Add a candidate
    await program.methods
      .addCandidate("Charlie")
      .accounts({
        candidate: candidateAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([candidateAccount])
      .rpc();

    // Get the vote count
    const candidate = await program.account.candidate.fetch(
      candidateAccount.publicKey
    );
    const voteCount = candidate.voteCount.toNumber();

    // Check the vote count
    assert.equal(voteCount, 0);
  });
});
