package tdd;

import org.junit.jupiter.api.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import tdd.test.Hero;
import tdd.test.Inventaire;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


public class AdventureTest {

    public static final String ANSI_RESET = "\u001B[0m";
    public static final String ANSI_BLACK = "\u001B[30m";
    public static final String ANSI_RED = "\u001B[31m";
    public static final String ANSI_GREEN = "\u001B[32m";
    public static final String ANSI_YELLOW = "\u001B[33m";
    public static final String ANSI_BLUE = "\u001B[34m";
    public static final String ANSI_PURPLE = "\u001B[35m";
    public static final String ANSI_CYAN = "\u001B[36m";
    public static final String ANSI_WHITE = "\u001B[37m";

    public static Inventaire inventaire;
    public static Scenario scenario;
    public static Hero hero;

    public static final List<SceneResult> resultats = new ArrayList<>(12);


    public static class Log {
        enum Level {DEBUG, INFO, SUCCESS, ERROR}

        public final Level level;
        public final String message;
        public final FailException failException;

        public Log(Level level, String message) {
            this.level = level;
            this.message = message;
            failException = null;
        }
        public Log(String message, FailException failException) {
            this.level = Level.ERROR;
            this.message = message;
            this.failException = failException;
        }
    }
    public static class SceneResult extends ArrayList<Log> {

        public void debug(String message) {
            add(new Log(Log.Level.DEBUG, message));
        }
        public void info(String message) {
            add(new Log(Log.Level.INFO, message));
        }
        public void success(String message) {
            add(new Log(Log.Level.SUCCESS, message));
        }

        public Optional<Log> getError() {
            Optional<Log> error = this.stream().filter(log -> log.level.equals(Log.Level.ERROR)).findFirst();
            return error;
        }

        public void console() {
            for(Log log : this) {
                switch (log.level) {
                    case ERROR:
                        System.out.println(ANSI_RED + log.message + ANSI_RESET);
                        break;
                    case SUCCESS:
                        System.out.println(ANSI_GREEN + log.message + ANSI_RESET);
                        break;
                    case DEBUG:
                        System.out.println(ANSI_BLUE + log.message + ANSI_RESET);
                        break;
                    default:
                        System.out.println(log.message);
                }
            }

        }
    }


    @BeforeAll
    public static void beforeAll() {
        run(new Adventure2());
    }

    public static void run(Adventure adventure) {
        inventaire = new tdd.test.Inventaire();
        scenario = new Scenario();
        hero = new Hero();
        resultats.clear();


        for(int i=0; i<=11; i++) {
            resultats.add(new SceneResult());
        }

        info(scenario.getScene().message); // message d'intro
        adventure.aventure(hero, inventaire);
    }


    @ParameterizedTest
    @ValueSource(ints = {0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11})
    public void testAventure(int number) {

        SceneResult result = resultats.get(number);
        result.console();

        // si on n'est pas arrivés au moins à la salle testée, alors le test ignoré
        Assumptions.assumeTrue(result.size() > 0);

        // s'il reste un ennemi dans la salle testée, alor c'est un echec
        Ennemi ennemi = scenario.scenes.get(number).ennemi;
        if(ennemi != null) {
            Assertions.fail(ennemi.nom + (ennemi.pluriel ? " sont" : " est") + " toujours là" );
        }

        Optional<Log> error = result.getError();
        if(error.isPresent()) {
            Assertions.fail(error.get().message, error.get().failException);
        }

    }
    public static void debug(String message) {
        resultats.get(scenario.position).debug(message);
    }
    public static void info(String message) {
        resultats.get(scenario.position).info(message);
    }
    public static void succes(String message) {
        resultats.get(scenario.position).success(message);
    }
    public static void fail(String message) {
        try {
            throw new FailException(message);
        } catch (FailException e) {
            resultats.get(scenario.position).add(new Log(message, e));
        }
    }

}