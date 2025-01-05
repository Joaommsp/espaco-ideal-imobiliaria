import { NextResponse } from "next/server";
import { createUserWithEmailAndPassword, Auth } from "firebase/auth";
import { clientAuth, clientDb } from "@/lib/services/firebase-service";
import { doc, setDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
  let jsonBody;
  try {
    jsonBody = await request.json();
  } catch (err) {
    console.error("Erro ao tentar ler o corpo da requisição:", err);
    return NextResponse.json(
      { error: "Dados inválidos ou malformados." },
      { status: 400 }
    );
  }

  const { userName, userEmail, userPassword } = jsonBody;

  if (!userName || !userEmail || !userPassword) {
    return NextResponse.json(
      { error: "Preencha todos os campos" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(userPassword, 10);

  if (!clientAuth) {
    return NextResponse.json(
      { error: "Erro de autenticação. Tente novamente mais tarde." },
      { status: 500 }
    );
  }

  if (!clientDb) {
    return NextResponse.json(
      {
        error: "Erro ao acessar o banco de dados. Tente novamente mais tarde.",
      },
      { status: 500 }
    );
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(
      clientAuth as Auth,
      userEmail,
      userPassword
    );
    const user = userCredential.user;

    const uniqueId = uuidv4();

    const docRef = doc(clientDb, "users", uniqueId);
    await setDoc(docRef, {
      idDataBase: uniqueId.toString(),
      userId: user.uid,
      name: userName,
      email: userEmail,
      password: hashedPassword,
      userPfp:
        "https://firebasestorage.googleapis.com/v0/b/espaco-ideal-auth-storage.appspot.com/o/assets%2Fdefaul-pfp.jpg?alt=media&token=619d102e-e104-4d63-af11-2b72b4421c7d",
    });

    return NextResponse.json({
      success: true,
      message: "Usuário criado com sucesso",
      id: uniqueId.toString(),
      firebaseId: user.uid,
      name: userName,
      email: userEmail,
      password: hashedPassword,
    });
  } catch (error: unknown) {
    console.error("Erro ao criar usuário: ", error);

    let errorMessage = "Ocorreu um erro desconhecido.";

    if (error instanceof Error) {
      if (error.message.includes("auth/email-already-in-use")) {
        errorMessage = "O e-mail já está em uso.";
      } else if (error.message.includes("auth/invalid-email")) {
        errorMessage = "E-mail inválido.";
      } else if (error.message.includes("auth/weak-password")) {
        errorMessage = "A senha é muito fraca.";
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
